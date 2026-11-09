package com.agroconnect.config;

import com.agroconnect.domain.Role;
import com.agroconnect.domain.User;
import com.agroconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AdminAccountBootstrap implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminAccountBootstrap.class);
    private final UserRepository users;
    private final PasswordEncoder passwords;
    @Value("${app.admin.access-id:}") private String accessId;
    @Value("${app.admin.access-token-hash:}") private String tokenHash;

    @Override
    public void run(ApplicationArguments args) {
        if (accessId == null || !accessId.matches("[0-9]{10}") || tokenHash == null || !tokenHash.matches("(?i)[0-9a-f]{64}")) {
            log.warn("Super Admin token login is disabled: configure ADMIN_ACCESS_ID and ADMIN_ACCESS_TOKEN_HASH privately");
            return;
        }
        String internalLogin = "ADMIN-" + accessId;
        User admin = users.findByPhoneNumber(internalLogin).orElse(null);
        if (admin == null) {
            admin = new User();
            admin.setFullName("AgroConnect Admin");
            admin.setPhoneNumber(internalLogin);
            admin.setPasswordHash(passwords.encode(UUID.randomUUID().toString()));
            admin.setRoles(EnumSet.of(Role.SUPER_ADMIN));
            admin.setRole(Role.SUPER_ADMIN);
            admin.setApproved(true);
            admin.setAccountEnabled(true);
            users.save(admin);
            log.info("Created the configured token-only Super Admin account");
        }
    }
}
