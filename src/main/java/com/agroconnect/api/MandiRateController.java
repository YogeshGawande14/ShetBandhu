package com.agroconnect.api;
import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.service.MandiRateService;
import com.agroconnect.service.AgmarknetClient;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.UUID;
@RestController @RequestMapping("/api/mandi-rates") @RequiredArgsConstructor
public class MandiRateController {
    private final MandiRateService service;
    private final AgmarknetClient agmarknet;
    @GetMapping public Page<MandiRateResponse> list(@RequestParam(required=false) String crop,@RequestParam(required=false) String district,@RequestParam(required=false) String tehsil,@RequestParam(required=false) String city,@RequestParam(required=false) String market,@PageableDefault(size=20,sort="recordDate",direction=Sort.Direction.DESC) Pageable page) { return service.list(crop,district,tehsil,city,market,page); }
    @GetMapping("/live") public java.util.List<MandiRateResponse> live(@RequestParam(required=false) String city) { return agmarknet.searchMaharashtra(city); }
    @GetMapping("/best") public java.util.List<MandiRateResponse> best(@RequestParam(required=false) String crop) { return service.bestMarkets(crop); }
    @GetMapping("/{id}") public MandiRateResponse get(@PathVariable UUID id) { return service.get(id); }
    @PostMapping @PreAuthorize("hasRole('SUPER_ADMIN')") public MandiRateResponse create(@Valid @RequestBody MandiRateRequest req) { return service.create(req); }
    @PutMapping("/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')") public MandiRateResponse update(@PathVariable UUID id,@Valid @RequestBody MandiRateRequest req) { return service.update(id,req); }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')") public void delete(@PathVariable UUID id) { service.delete(id); }
}

