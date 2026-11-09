package com.agroconnect.api;

import com.agroconnect.api.dto.ApiDtos.AdminAccountResponse;
import com.agroconnect.api.dto.ApiDtos.AdminAccountStatusRequest;
import com.agroconnect.service.AdminAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminAccountController {
    private final AdminAccountService service;
    private final CurrentUser currentUser;

    @GetMapping
    public Page<AdminAccountResponse> list(@RequestParam(required = false) String query,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "25") int size) {
        return service.list(query, page, size);
    }

    @PatchMapping("/{id}/status")
    public AdminAccountResponse setStatus(@PathVariable UUID id,
                                          @Valid @RequestBody AdminAccountStatusRequest request,
                                          Authentication authentication) {
        return service.setEnabled(currentUser.id(authentication), id, request.accountEnabled());
    }
}
