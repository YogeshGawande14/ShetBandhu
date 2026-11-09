package com.agroconnect.api;
import com.agroconnect.domain.User;
import com.agroconnect.repository.UserRepository;
import com.agroconnect.service.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.util.UUID;
import com.agroconnect.domain.Role;
@Component @RequiredArgsConstructor
public class CurrentUser {
    private final UserRepository users;
    public User get(Authentication auth) { return users.findByPhoneNumber(auth.getName()).orElseThrow(()->new NotFoundException("User not found")); }
    public UUID id(Authentication auth) { return get(auth).getId(); }
    public Role activeRole(Authentication auth) { return auth.getAuthorities().stream().map(a->a.getAuthority()).filter(a->a.startsWith("ROLE_")).map(a->Role.valueOf(a.substring(5))).findFirst().orElseThrow(()->new org.springframework.security.access.AccessDeniedException("Active role is missing")); }
    public boolean admin(Authentication auth) { return auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_SUPER_ADMIN")); }
}
