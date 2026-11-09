package com.agroconnect.api.dto;

import com.agroconnect.domain.DeliveryType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record OrderCreateRequest(
        @NotNull UUID shopId,
        @NotEmpty List<ApiDtos.@Valid OrderLine> items,
        @NotNull DeliveryType deliveryType,
        @Size(max=1000) String voiceAudioUrl,
        @Size(max=2000) String voiceTranscript) {}
