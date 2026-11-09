package com.agroconnect.api;

import com.agroconnect.api.dto.ApiDtos.ProductReviewRequest;
import com.agroconnect.api.dto.ApiDtos.ProductReviewResponse;
import com.agroconnect.api.dto.ApiDtos.ProductReviewSummary;
import com.agroconnect.service.ProductReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/products/{productId}/reviews") @RequiredArgsConstructor
public class ProductReviewController {
    private final ProductReviewService service; private final CurrentUser current;
    @GetMapping public ProductReviewSummary list(@PathVariable UUID productId){return service.list(productId);}
    @PostMapping @PreAuthorize("hasRole('FARMER')") public ProductReviewResponse create(@PathVariable UUID productId,@Valid @RequestBody ProductReviewRequest request,Authentication auth){return service.create(productId,current.id(auth),request);}
}
