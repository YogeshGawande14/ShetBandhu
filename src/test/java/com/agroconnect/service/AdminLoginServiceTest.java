package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.AdminTokenLoginRequest;
import com.agroconnect.domain.Role;
import com.agroconnect.domain.User;
import com.agroconnect.repository.UserRepository;
import com.agroconnect.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.EnumSet;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminLoginServiceTest {
    private static final String ACCESS_ID = "9876543210";
    private static final String TOKEN = "a-test-only-token-with-32-characters";
    @Mock private UserRepository users;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    private AuthService service;

    @BeforeEach
    void setUp() throws Exception {
        service = new AuthService(users, passwordEncoder, authenticationManager,
                new JwtService("0123456789abcdef0123456789abcdef", 3600000), new MediaStorageService("target/test-uploads"));
        ReflectionTestUtils.setField(service, "adminAccessId", ACCESS_ID);
        String hash = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(TOKEN.getBytes(StandardCharsets.UTF_8)));
        ReflectionTestUtils.setField(service, "adminAccessTokenHash", hash);
    }

    @Test
    void validAccessIdAndTokenReturnAdminSession() {
        User admin = user(Role.SUPER_ADMIN);
        when(users.findByPhoneNumber("ADMIN-" + ACCESS_ID)).thenReturn(Optional.of(admin));
        var response = service.adminLogin(new AdminTokenLoginRequest(ACCESS_ID, TOKEN));
        assertNotNull(response.accessToken());
        assertEquals(Role.SUPER_ADMIN, response.activeRole());
    }

    @Test
    void invalidTokenIsRejected() {
        assertThrows(BadCredentialsException.class,
                () -> service.adminLogin(new AdminTokenLoginRequest(ACCESS_ID, "wrong-token-value-which-is-at-least-32")));
    }

    @Test
    void farmerAccountCannotUseAdminToken() {
        when(users.findByPhoneNumber("ADMIN-" + ACCESS_ID)).thenReturn(Optional.of(user(Role.FARMER)));
        assertThrows(BadCredentialsException.class,
                () -> service.adminLogin(new AdminTokenLoginRequest(ACCESS_ID, TOKEN)));
    }

    private User user(Role role) {
        User user = new User(); user.setId(UUID.randomUUID()); user.setFullName("Test Account");
        user.setPhoneNumber(ACCESS_ID); user.setPasswordHash("encoded"); user.setRole(role);
        user.setRoles(EnumSet.of(role)); user.setAccountEnabled(true); user.setTokenVersion(0);
        return user;
    }
}
