package com.agroconnect.api;
import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController @RequestMapping("/api/products") @RequiredArgsConstructor
public class ProductController {
    private final ProductService service; private final CurrentUser current;
    @GetMapping("/mine") @PreAuthorize("hasRole('SHOP_OWNER')") public Page<ProductResponse> mine(Authentication auth,@PageableDefault(size=50,sort="createdAt",direction=Sort.Direction.DESC) Pageable page) { return service.mine(current.id(auth),page); }
    @GetMapping public Page<ProductResponse> list(@RequestParam(required=false) String q,@RequestParam(required=false) String category,@PageableDefault(size=20,sort="productName") Pageable page) { return service.list(q,category,page); }
    @GetMapping("/{id}") public ProductResponse get(@PathVariable UUID id) { return service.get(id); }
    @PostMapping @PreAuthorize("hasRole('SHOP_OWNER')") public ProductResponse create(@Valid @RequestBody ProductRequest req,Authentication auth) { return service.create(req,current.id(auth)); }
    @PutMapping("/{id}") @PreAuthorize("hasRole('SHOP_OWNER')") public ProductResponse update(@PathVariable UUID id,@Valid @RequestBody ProductRequest req,Authentication auth) { return service.update(id,req,current.id(auth),current.admin(auth)); }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('SHOP_OWNER')") public void delete(@PathVariable UUID id,Authentication auth) { service.delete(id,current.id(auth),current.admin(auth)); }
}
