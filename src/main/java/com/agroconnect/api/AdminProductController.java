package com.agroconnect.api;

import com.agroconnect.api.dto.ApiDtos.AdminProductResponse;
import com.agroconnect.api.dto.ApiDtos.ProductModerationRequest;
import com.agroconnect.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminProductController {
    private final ProductService products;
    private final CurrentUser currentUser;

    @GetMapping
    public Page<AdminProductResponse> list(@RequestParam(required = false) String query,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "50") int size) {
        return products.adminList(query, PageRequest.of(Math.max(0, page), Math.max(1, Math.min(size, 100)), Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    @PatchMapping("/{id}/moderation")
    public AdminProductResponse moderate(@PathVariable UUID id, @Valid @RequestBody ProductModerationRequest request, Authentication auth) {
        return products.moderate(id, currentUser.id(auth), request.approved(), request.reason());
    }
}
