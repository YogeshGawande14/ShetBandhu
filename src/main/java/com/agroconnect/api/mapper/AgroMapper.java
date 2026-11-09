package com.agroconnect.api.mapper;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.domain.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel="spring")
public interface AgroMapper {
    @Mapping(target="id", ignore=true) @Mapping(target="shop", ignore=true) @Mapping(target="createdAt", ignore=true)
    @Mapping(target="productName", source="name")
    AgriProduct product(ProductRequest request);
    @Mapping(target="shopId", source="shop.id") @Mapping(target="shopName", source="shop.shopName")
    @Mapping(target="name", source="productName")
    ProductResponse product(AgriProduct entity);
    @Mapping(target="id", ignore=true)
    MandiRate rate(MandiRateRequest request);
    MandiRateResponse rate(MandiRate entity);
    @Mapping(target="id", ignore=true) @Mapping(target="owner", ignore=true)
    @Mapping(target="verified", ignore=true) @Mapping(target="verificationStatus", ignore=true) @Mapping(target="createdAt", ignore=true)
    KrishiSevaKendra kendra(KendraRequest request);
    @Mapping(target="ownerId", source="owner.id") @Mapping(target="distanceInKm", ignore=true)
    KendraResponse kendra(KrishiSevaKendra entity);
}
