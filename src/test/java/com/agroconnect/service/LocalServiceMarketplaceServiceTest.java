package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.LocalServiceSearchRequest;
import com.agroconnect.repository.LocalServiceContactThreadRepository;
import com.agroconnect.repository.LocalServiceListingRepository;
import com.agroconnect.repository.LocalServiceMessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocalServiceMarketplaceServiceTest {
    @Mock private LocalServiceListingRepository listings;
    @Mock private LocalServiceContactThreadRepository threads;
    @Mock private LocalServiceMessageRepository messages;
    @InjectMocks private LocalServiceMarketplaceService service;

    @Test
    void districtOnlySearchIsAcceptedWhenNoListingsMatch() {
        when(listings.findByActiveTrueOrderByCreatedAtDesc()).thenReturn(List.of());

        var result = service.search(new LocalServiceSearchRequest(null, null, null, null, "Akola", "ALL"));

        assertTrue(result.isEmpty());
        verify(listings).findByActiveTrueOrderByCreatedAtDesc();
    }
}
