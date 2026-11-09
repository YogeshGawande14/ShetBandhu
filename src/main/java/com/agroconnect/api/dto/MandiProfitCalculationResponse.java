package com.agroconnect.api.dto;

import com.agroconnect.domain.CropType;
import java.math.BigDecimal;
import java.util.List;

public record MandiProfitCalculationResponse(CropType cropName, BigDecimal quantityInQuintals,
                                               List<ApiDtos.ProfitOption> rankedMandis) {}
