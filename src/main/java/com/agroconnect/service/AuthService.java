package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.domain.User;
import com.agroconnect.domain.Role;
import com.agroconnect.repository.UserRepository;
import com.agroconnect.security.JwtService;
import lombok.RequiredArgsConstructor;
import java.util.EnumSet;
import java.util.UUID;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final MediaStorageService mediaStorage;
    @Value("${app.admin.access-id:}") private String adminAccessId;
    @Value("${app.admin.access-token-hash:}") private String adminAccessTokenHash;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (users.existsByPhoneNumber(request.phoneNumber())) throw new ConflictException("Phone number is already registered");
        if(request.role()==com.agroconnect.domain.Role.SUPER_ADMIN) throw new BadRequestException("Super admin accounts cannot be self-registered");
        User user=new User(); user.setFullName(request.fullName()); user.setPhoneNumber(request.phoneNumber());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRoles(EnumSet.of(Role.FARMER));
        if(request.role()==Role.SHOP_OWNER) user.getRoles().add(Role.SHOP_OWNER);
        user.setRole(Role.FARMER); user.setVillage(request.village());
        user.setDistrict(request.district()); user.setLatitude(request.latitude()); user.setLongitude(request.longitude());
        return token(users.save(user));
    }
    @Transactional(readOnly=true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.phoneNumber(), request.password()));
        User user = users.findByPhoneNumber(request.phoneNumber()).orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        Role requested = request.activeRole() == null ? Role.FARMER : request.activeRole();
        if (requested != Role.FARMER && requested != Role.SHOP_OWNER) throw new BadCredentialsException("Choose a valid customer or owner sign-in");
        if (requested == Role.SHOP_OWNER && !user.getRoles().contains(Role.SHOP_OWNER)) throw new BadCredentialsException("This account does not have Seva Kendra or agency access");
        return token(user, requested);
    }
    @Transactional(readOnly=true)
    public AuthResponse adminLogin(AdminTokenLoginRequest request) {
        if (adminAccessId == null || adminAccessId.isBlank() || adminAccessTokenHash == null || adminAccessTokenHash.length() != 64
                || !MessageDigest.isEqual(request.accessId().getBytes(StandardCharsets.US_ASCII), adminAccessId.getBytes(StandardCharsets.US_ASCII))
                || !MessageDigest.isEqual(sha256(request.accessToken()).getBytes(StandardCharsets.US_ASCII), adminAccessTokenHash.toLowerCase(java.util.Locale.ROOT).getBytes(StandardCharsets.US_ASCII)))
            throw new BadCredentialsException("Invalid Super Admin access credentials");
        User user=users.findByPhoneNumber("ADMIN-" + adminAccessId).orElseThrow(() -> new BadCredentialsException("Super Admin account is not configured"));
        if (!user.getRoles().contains(Role.SUPER_ADMIN) || !user.isAccountEnabled()) throw new BadCredentialsException("Invalid Super Admin access credentials");
        return token(user, Role.SUPER_ADMIN);
    }
    @Transactional(readOnly=true)
    public AuthResponse switchRole(UUID userId, Role activeRole) {
        User user=users.findById(userId).orElseThrow(()->new BadRequestException("Account not found"));
        boolean allowed = activeRole != null && (user.getRoles().contains(activeRole)
                || (activeRole == Role.FARMER && (user.getRoles().contains(Role.SHOP_OWNER) || user.getRoles().contains(Role.SUPER_ADMIN))));
        if(!allowed) throw new BadRequestException("This role is not enabled for your account");
        return token(user,activeRole);
    }
    @Transactional
    public void logoutEverywhere(UUID userId) {
        User user=users.findById(userId).orElseThrow(()->new BadRequestException("Account not found"));
        user.setTokenVersion(user.getTokenVersion()+1);
        users.save(user);
    }
    private AuthResponse token(User user) { return token(user,user.getRole()); }
    private AuthResponse token(User user, Role activeRole) {
        EnumSet<Role> available=EnumSet.copyOf(user.getRoles());
        if(user.getRoles().contains(Role.SHOP_OWNER)||user.getRoles().contains(Role.SUPER_ADMIN)) available.add(Role.FARMER);
        return new AuthResponse(jwtService.generate(user,activeRole), "Bearer", jwtService.expiresAt(), user.getId(), user.getFullName(), activeRole, available, activeRole, user.getVillage(), user.getDistrict(), user.getProfilePhotoUrl());
    }
    @Transactional public ProfilePhotoResponse updateProfilePhoto(UUID userId,org.springframework.web.multipart.MultipartFile photo) { User user=users.findById(userId).orElseThrow(()->new NotFoundException("Account not found")); user.setProfilePhotoUrl(mediaStorage.saveImage(photo)); users.save(user); return new ProfilePhotoResponse(user.getProfilePhotoUrl()); }
    private String sha256(String value) { try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); } catch (Exception ex) { throw new IllegalStateException("SHA-256 unavailable",ex); } }
}
