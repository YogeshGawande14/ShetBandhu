package com.agroconnect.api;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.service.SupportDeskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/support") @RequiredArgsConstructor
public class SupportDeskController {
    private final SupportDeskService service;
    private final CurrentUser current;

    @PostMapping @PreAuthorize("hasAnyRole('FARMER','SHOP_OWNER')")
    public SupportTicketResponse create(@Valid @RequestBody SupportTicketCreate request,Authentication auth){return service.create(current.id(auth),request);}

    @GetMapping("/mine") @PreAuthorize("hasAnyRole('FARMER','SHOP_OWNER')")
    public List<SupportTicketResponse> mine(Authentication auth){return service.mine(current.id(auth));}

    @GetMapping("/admin") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<SupportTicketResponse> adminQueue(){return service.adminQueue();}

    @PatchMapping("/admin/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public SupportTicketResponse respond(@PathVariable UUID id,@Valid @RequestBody SupportReplyRequest request){return service.respond(id,request);}
}
