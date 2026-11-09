package com.agroconnect.api;

import com.agroconnect.api.dto.ApiDtos.CheckoutRequest;
import com.agroconnect.api.dto.ApiDtos.CheckoutResponse;
import com.agroconnect.api.dto.ApiDtos.OrderResponse;
import com.agroconnect.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {
    private final OrderService service;
    private final CurrentUser current;

    @PostMapping("/guest")
    public CheckoutResponse guest(@Valid @RequestBody CheckoutRequest request) {
        return service.checkoutGuest(request);
    }

    @PostMapping @PreAuthorize("hasRole('FARMER')")
    public CheckoutResponse farmer(@Valid @RequestBody CheckoutRequest request, Authentication authentication) {
        return service.checkoutFarmer(request, current.id(authentication));
    }

    @GetMapping("/guest/{orderId}")
    public OrderResponse trackGuest(@PathVariable UUID orderId,
                                    @RequestHeader("X-Guest-Access-Token") String accessToken) {
        return service.trackGuest(orderId, accessToken);
    }
}
