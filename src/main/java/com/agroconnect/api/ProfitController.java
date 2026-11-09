package com.agroconnect.api;
import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.api.dto.MandiProfitCalculationResponse;
import com.agroconnect.service.MandiRateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/profit") @RequiredArgsConstructor
public class ProfitController {
    private final MandiRateService service;
    @PostMapping("/calculate") public MandiProfitCalculationResponse calculate(@Valid @RequestBody ProfitRequest req) { return service.profit(req); }
}
