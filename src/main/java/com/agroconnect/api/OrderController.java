package com.agroconnect.api;
import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import java.util.UUID;
@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor
public class OrderController {
    private final OrderService service; private final CurrentUser current;
    @GetMapping public Page<OrderResponse> mine(Authentication auth,@PageableDefault(size=20,sort="createdAt",direction=Sort.Direction.DESC) Pageable page) { var user=current.get(auth); return service.mine(user.getId(),current.activeRole(auth),page); }
    @PostMapping @PreAuthorize("hasRole('FARMER')") public OrderResponse place(@Valid @RequestBody OrderRequest req,Authentication auth) { return service.place(req,current.id(auth)); }
    @GetMapping("/{id}") public OrderResponse get(@PathVariable UUID id,Authentication auth) { return service.get(id,current.id(auth),current.admin(auth)); }
    @PatchMapping("/{id}/status") public OrderResponse status(@PathVariable UUID id,@Valid @RequestBody OrderStatusRequest req,Authentication auth) { return service.changeStatus(id,req.status(),current.id(auth),current.activeRole(auth)); }
}
