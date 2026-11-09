package com.agroconnect.service;

import com.agroconnect.domain.Role;
import com.agroconnect.domain.User;
import com.agroconnect.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.Instant;
import java.util.EnumSet;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAccountServiceTest {
    @Mock private UserRepository users;
    @InjectMocks private AdminAccountService service;

    @Test
    void suspendingAccountMasksPhoneAndRevokesCurrentSessions() {
        UUID adminId=UUID.randomUUID(), accountId=UUID.randomUUID(); User target=user(accountId,Role.FARMER);
        when(users.findById(accountId)).thenReturn(Optional.of(target));
        when(users.save(any(User.class))).thenAnswer(invocation->invocation.getArgument(0));
        var response=service.setEnabled(adminId,accountId,false);
        assertFalse(target.isAccountEnabled()); assertEquals(1,target.getTokenVersion());
        assertEquals("••••••3210",response.maskedPhone()); assertFalse(response.accountEnabled());
        verify(users).save(target);
    }

    @Test
    void cannotSuspendAnotherSuperAdminFromAccountList() {
        UUID adminId=UUID.randomUUID(), accountId=UUID.randomUUID();
        when(users.findById(accountId)).thenReturn(Optional.of(user(accountId,Role.SUPER_ADMIN)));
        assertThrows(AccessDeniedException.class,()->service.setEnabled(adminId,accountId,false));
        verify(users,never()).save(any(User.class));
    }

    private User user(UUID id,Role role) {
        User user=new User(); user.setId(id); user.setFullName("Test Account"); user.setPhoneNumber("9876543210");
        user.setPasswordHash("test-password-hash"); user.setRole(role); user.setRoles(EnumSet.of(role));
        user.setDistrict("Pune"); user.setVillage("Haveli"); user.setAccountEnabled(true);
        user.setCreatedAt(Instant.parse("2026-11-06T00:00:00Z")); return user;
    }
}
