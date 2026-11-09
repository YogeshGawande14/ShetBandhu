package com.agroconnect.api;
import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService service;
    private final CurrentUser current;
    @PostMapping("/register") public AuthResponse register(@Valid @RequestBody RegisterRequest req) { return service.register(req); }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest req) { return service.login(req); }
    @PostMapping("/admin/login") public AuthResponse adminLogin(@Valid @RequestBody AdminTokenLoginRequest req) { return service.adminLogin(req); }
    @PostMapping("/active-role") public AuthResponse activeRole(@Valid @RequestBody ActiveRoleRequest req, Authentication auth) { return service.switchRole(current.id(auth), req.activeRole()); }
    @PatchMapping(value="/profile/photo",consumes=org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE) @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()") public ProfilePhotoResponse updateProfilePhoto(Authentication auth,@RequestParam("file") org.springframework.web.multipart.MultipartFile file) { return service.updateProfilePhoto(current.id(auth),file); }
        @PostMapping("/logout") public void logout(Authentication auth) { service.logoutEverywhere(current.id(auth)); }
    @PostMapping("/logout-all") public void logoutAll(Authentication auth) { service.logoutEverywhere(current.id(auth)); }
}
