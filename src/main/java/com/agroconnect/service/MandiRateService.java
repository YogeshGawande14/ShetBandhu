package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.api.dto.MandiProfitCalculationResponse;
import com.agroconnect.api.mapper.AgroMapper;
import com.agroconnect.domain.CropType;
import com.agroconnect.domain.MandiRate;
import com.agroconnect.repository.MandiRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class MandiRateService {
    private final MandiRateRepository rates;
    private final AgroMapper mapper;

    @Transactional(readOnly=true)
    public Page<MandiRateResponse> list(String crop, String district, String tehsil, String city, String market, Pageable pageable) {
        return rates.findAll((root,q,cb)->cb.and(
                crop==null||crop.isBlank()?cb.conjunction():cb.equal(root.get("cropName"), CropType.valueOf(crop.toUpperCase())),
                district==null||district.isBlank()?cb.conjunction():cb.like(cb.lower(root.get("district")),"%"+district.trim().toLowerCase()+"%"),
                tehsil==null||tehsil.isBlank()?cb.conjunction():cb.like(cb.lower(root.get("tehsil")),"%"+tehsil.trim().toLowerCase()+"%"),
                city==null||city.isBlank()?cb.conjunction():cb.or(
                        cb.like(cb.lower(root.get("city")),"%"+city.trim().toLowerCase()+"%"),
                        cb.like(cb.lower(root.get("district")),"%"+city.trim().toLowerCase()+"%"),
                        cb.like(cb.lower(root.get("tehsil")),"%"+city.trim().toLowerCase()+"%"),
                        cb.like(cb.lower(root.get("mandiName")),"%"+city.trim().toLowerCase()+"%")),
                market==null||market.isBlank()?cb.conjunction():cb.like(cb.lower(root.get("mandiName")),"%"+market.trim().toLowerCase()+"%")),pageable).map(mapper::rate);
    }
    @Transactional(readOnly=true)
    public java.util.List<MandiRateResponse> bestMarkets(String crop) {
        java.time.LocalDate today = LocalDate.now();
        java.util.List<MandiRate> all = rates.findAll((root,q,cb)->cb.and(
                cb.lessThanOrEqualTo(root.get("recordDate"), today),
                cb.notEqual(root.get("sourceLabel"), "DEMO"),
                crop==null||crop.isBlank()?cb.conjunction():cb.equal(root.get("cropName"),CropType.valueOf(crop.toUpperCase()))), Sort.by(Sort.Direction.DESC,"recordDate"));
        java.util.Map<String,MandiRate> latestByMarket = new java.util.LinkedHashMap<>();
        for (MandiRate rate : all) {
            String key = rate.getCropName()+"|"+rate.getMandiName().trim().toLowerCase(java.util.Locale.ROOT)+"|"+(rate.getDistrict()==null?"":rate.getDistrict().trim().toLowerCase(java.util.Locale.ROOT));
            latestByMarket.putIfAbsent(key, rate);
        }
        return latestByMarket.values().stream().sorted(java.util.Comparator.comparing(MandiRate::getRatePerQuintal).reversed())
                .map(mapper::rate).toList();
    }
    @Transactional(readOnly=true) public MandiRateResponse get(UUID id) { return mapper.rate(find(id)); }
    @Transactional public MandiRateResponse create(MandiRateRequest req) { validate(req); MandiRate r=mapper.rate(req); r.setAutoFetched(false); r.setSourceLabel("ADMIN_REPORTED"); return mapper.rate(rates.save(r)); }
    @Transactional public MandiRateResponse update(UUID id,MandiRateRequest req) {
        validate(req); MandiRate r=find(id); r.setCropName(req.cropName()); r.setMandiName(req.mandiName()); r.setDistrict(req.district()); r.setTehsil(req.tehsil()); r.setCity(req.city());
        r.setRecordDate(req.recordDate()); r.setMinRate(req.minRate()); r.setMaxRate(req.maxRate()); r.setRatePerQuintal(req.ratePerQuintal()); r.setTransportCostPerQtl(req.transportCostPerQtl()); r.setAutoFetched(false); r.setSourceLabel("ADMIN_REPORTED");
        return mapper.rate(r);
    }
    @Transactional public void delete(UUID id) { rates.delete(find(id)); }
    @Transactional(readOnly=true) public MandiProfitCalculationResponse profit(ProfitRequest request) {
        var options=rates.findAll((root,q,cb)->cb.and(cb.equal(root.get("cropName"),request.cropName()),cb.lessThanOrEqualTo(root.get("recordDate"),LocalDate.now()),cb.notEqual(root.get("sourceLabel"),"DEMO")),
                        Sort.by(Sort.Direction.DESC,"recordDate")).stream().map(r->{
                    BigDecimal gross=r.getRatePerQuintal().multiply(request.quantityInQuintals()).setScale(2,RoundingMode.HALF_UP);
                    BigDecimal cost=r.getTransportCostPerQtl().multiply(request.quantityInQuintals()).setScale(2,RoundingMode.HALF_UP);
                    return new ProfitOption(r.getMandiName(),r.getRatePerQuintal(),r.getTransportCostPerQtl(),gross,cost,gross.subtract(cost),r.getDistrict(),r.getRecordDate());
                }).sorted(Comparator.comparing(ProfitOption::netProfit).reversed()).toList();
        return new MandiProfitCalculationResponse(request.cropName(),request.quantityInQuintals(),options);
    }
    private MandiRate find(UUID id) { return rates.findById(id).orElseThrow(()->new NotFoundException("Mandi rate not found")); }
    private void validate(MandiRateRequest r) { if(r.minRate().compareTo(r.ratePerQuintal())>0||r.ratePerQuintal().compareTo(r.maxRate())>0) throw new BadRequestException("Rates must satisfy minRate <= ratePerQuintal <= maxRate"); }
}
