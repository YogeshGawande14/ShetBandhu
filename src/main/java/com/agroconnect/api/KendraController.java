package com.agroconnect.api;
import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.service.KendraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
@RestController @RequestMapping("/api/kendras") @RequiredArgsConstructor
public class KendraController {
    private final KendraService service; private final CurrentUser current;
    @GetMapping("/search") public List<KendraSearchResponse> search(@RequestParam("q") String query) { return service.search(query); }
    @GetMapping("/nearby") public List<KendraResponse> nearby(@RequestParam BigDecimal latitude,@RequestParam BigDecimal longitude,@RequestParam(defaultValue="10") double radiusKm) { return service.nearby(latitude,longitude,radiusKm); }
    @GetMapping("/mine") @PreAuthorize("hasRole('SHOP_OWNER')") public List<KendraResponse> mine(Authentication auth) { return service.myShops(current.id(auth)); }
    @PostMapping @PreAuthorize("hasRole('SHOP_OWNER')") public KendraResponse create(@Valid @RequestBody KendraRequest req,Authentication auth) { return service.create(req,current.id(auth)); }
}


