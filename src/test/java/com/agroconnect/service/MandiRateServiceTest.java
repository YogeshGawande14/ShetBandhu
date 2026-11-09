package com.agroconnect.service;

import com.agroconnect.api.mapper.AgroMapper;
import com.agroconnect.domain.CropType;
import com.agroconnect.domain.MandiRate;
import com.agroconnect.repository.MandiRateRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MandiRateServiceTest {
    @Test void ranksMandisByNetProfitAfterTransport() {
        MandiRateRepository repository=mock(MandiRateRepository.class);
        MandiRate latur=rate("Latur", "5000", "100");
        MandiRate pune=rate("Pune", "5100", "300");
        when(repository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of(latur,pune));
        var response=new MandiRateService(repository,mock(AgroMapper.class)).profit(new com.agroconnect.api.dto.ApiDtos.ProfitRequest(CropType.SOYBEAN,new BigDecimal("2")));
        assertEquals("Latur",response.rankedMandis().getFirst().mandiName());
        assertEquals(new BigDecimal("9800.00"),response.rankedMandis().getFirst().netProfit());
    }
    @Test void returnsNoOptionsWhenNoRatesExist() {
        MandiRateRepository repository=mock(MandiRateRepository.class);
        when(repository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of());
        var response=new MandiRateService(repository,mock(AgroMapper.class)).profit(new com.agroconnect.api.dto.ApiDtos.ProfitRequest(CropType.WHEAT,BigDecimal.ONE));
        assertTrue(response.rankedMandis().isEmpty());
    }
    private MandiRate rate(String market,String price,String transport) {
        MandiRate rate=new MandiRate(); rate.setMandiName(market); rate.setCropName(CropType.SOYBEAN);
        rate.setRatePerQuintal(new BigDecimal(price)); rate.setTransportCostPerQtl(new BigDecimal(transport));
        rate.setRecordDate(LocalDate.now()); rate.setMinRate(new BigDecimal(price).subtract(BigDecimal.TEN)); rate.setMaxRate(new BigDecimal(price).add(BigDecimal.TEN));
        return rate;
    }
}
