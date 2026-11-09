package com.agroconnect.api;

import com.agroconnect.api.dto.ApiDtos.SchemeRequest;
import com.agroconnect.api.dto.ApiDtos.SchemeResponse;
import com.agroconnect.service.GovernmentSchemeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/admin/schemes") @RequiredArgsConstructor @PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminSchemeController {
    private final GovernmentSchemeService service;
    @GetMapping public List<SchemeResponse> list(){return service.adminList();}
    @PostMapping public SchemeResponse create(@Valid @RequestBody SchemeRequest request){return service.create(request);}
    @PutMapping("/{id}") public SchemeResponse update(@PathVariable UUID id,@Valid @RequestBody SchemeRequest request){return service.update(id,request);}
    @DeleteMapping("/{id}") public void delete(@PathVariable UUID id){service.delete(id);}
}
