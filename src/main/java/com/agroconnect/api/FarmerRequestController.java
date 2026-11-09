package com.agroconnect.api;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.service.FarmerRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/requests") @RequiredArgsConstructor
public class FarmerRequestController {
    private final FarmerRequestService service;
    private final CurrentUser current;
    @PostMapping @PreAuthorize("hasRole('FARMER')") public FarmerRequestResponse create(@Valid @RequestBody FarmerRequestCreate body,Authentication auth){return service.create(body,current.id(auth));}
    @GetMapping @PreAuthorize("hasRole('FARMER')") public List<FarmerRequestResponse> mine(Authentication auth){return service.mine(current.id(auth));}
    @GetMapping("/owner") @PreAuthorize("hasRole('SHOP_OWNER')") public List<FarmerRequestResponse> owner(Authentication auth){return service.openForOwner(current.id(auth));}
    @PostMapping("/{id}/replies") @PreAuthorize("hasRole('SHOP_OWNER')") public FarmerRequestReplyResponse reply(@PathVariable UUID id,@Valid @RequestBody FarmerRequestReply body,Authentication auth){return service.reply(id,body,current.id(auth));}
}
