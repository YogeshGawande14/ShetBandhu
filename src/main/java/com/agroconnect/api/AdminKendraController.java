package com.agroconnect.api;

import com.agroconnect.api.dto.ApiDtos.AdminKendraReviewResponse;
import com.agroconnect.api.dto.ApiDtos.KendraResponse;
import com.agroconnect.api.dto.ApiDtos.AdminKendraApprovalRequest;
import com.agroconnect.service.KendraService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.agroconnect.domain.KrishiSevaKendra;
import com.agroconnect.domain.VerificationStatus;
import java.util.List;
import java.util.UUID;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/admin/kendras")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminKendraController {
    private final KendraService service;
    private final CurrentUser currentUser;

    @GetMapping
    public List<AdminKendraReviewResponse> directory(@RequestParam(required = false) String city,
                                                      @RequestParam(required = false) String businessType,
                                                      @RequestParam(required = false) VerificationStatus status) {
        return service.businessDirectory(city, businessType, status);
    }

    @GetMapping("/pending")
    public List<AdminKendraReviewResponse> pending() { return service.pendingReviews(); }

    @PatchMapping("/{id}/verify")
    public KendraResponse verify(@PathVariable UUID id, @Valid @RequestBody AdminKendraApprovalRequest request, Authentication auth) { return service.verify(id, currentUser.id(auth), request.overrideMissingDocuments(), request.reason()); }

    @PatchMapping("/{id}/reject")
    public KendraResponse reject(@PathVariable UUID id) { return service.reject(id); }
}
