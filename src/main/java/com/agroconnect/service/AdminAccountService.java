package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.AdminAccountResponse;
import com.agroconnect.domain.Role;
import com.agroconnect.domain.User;
import com.agroconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminAccountService {
    private final UserRepository users;

    @Transactional(readOnly = true)
    public Page<AdminAccountResponse> list(String query, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, Math.min(size, 100)), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> accounts = query == null || query.isBlank()
                ? users.findAll(pageable)
                : users.findByFullNameContainingIgnoreCaseOrPhoneNumberContainingIgnoreCase(query.trim(), query.trim(), pageable);
        return accounts.map(this::toResponse);
    }

    @Transactional
    public AdminAccountResponse setEnabled(UUID adminId, UUID accountId, boolean enabled) {
        User target = users.findById(accountId).orElseThrow(() -> new NotFoundException("Account not found"));
        if (adminId.equals(accountId)) throw new BadRequestException("You cannot disable or change your own account here");
        if (target.getRoles().contains(Role.SUPER_ADMIN)) throw new AccessDeniedException("Super Admin accounts cannot be changed from this screen");
        if (target.isAccountEnabled() != enabled) {
            target.setAccountEnabled(enabled);
            if (!enabled) target.setTokenVersion(target.getTokenVersion() + 1);
            target = users.save(target);
        }
        return toResponse(target);
    }

    private AdminAccountResponse toResponse(User user) {
        String phone = user.getPhoneNumber();
        String maskedPhone = phone.length() <= 4 ? "••••" : "••••••" + phone.substring(phone.length() - 4);
        return new AdminAccountResponse(user.getId(), user.getFullName(), maskedPhone, Set.copyOf(user.getRoles()), user.getDistrict(), user.getVillage(), user.isAccountEnabled(), user.getCreatedAt());
    }
}
