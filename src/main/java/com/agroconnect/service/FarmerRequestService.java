package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.domain.*;
import com.agroconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class FarmerRequestService {
    private final FarmerProductRequestRepository requests;
    private final FarmerProductRequestResponseRepository responses;
    private final UserRepository users;
    private final KendraRepository kendras;

    @Transactional
    public FarmerRequestResponse create(FarmerRequestCreate input, UUID farmerId) {
        User farmer=users.findById(farmerId).orElseThrow(()->new NotFoundException("Account not found"));
        if(!farmer.getRoles().contains(Role.FARMER)) throw new AccessDeniedException("Farmer role required");
        FarmerProductRequest r=new FarmerProductRequest(); r.setFarmer(farmer); r.setProductName(input.productName().trim());
        r.setQuantityDescription(input.quantityDescription().trim()); r.setVillage(input.village().trim()); r.setDistrict(input.district().trim());
        r.setPostalCode(input.postalCode()); r.setImageUrl(input.imageUrl());
        r=requests.save(r); return response(r);
    }

    @Transactional(readOnly=true)
    public List<FarmerRequestResponse> mine(UUID farmerId) { return requests.findByFarmer_IdOrderByCreatedAtDesc(farmerId).stream().map(this::response).toList(); }

    @Transactional(readOnly=true)
    public List<FarmerRequestResponse> openForOwner(UUID ownerId) {
        User owner=users.findById(ownerId).orElseThrow(()->new NotFoundException("Owner account not found"));
        if(!owner.getRoles().contains(Role.SHOP_OWNER)) throw new AccessDeniedException("Kendra Owner role required");
        java.util.Map<UUID,FarmerProductRequest> routed=new java.util.LinkedHashMap<>();
        if(owner.getDistrict()!=null&&!owner.getDistrict().isBlank()) requests.findByDistrictIgnoreCaseAndStatusOrderByCreatedAtDesc(owner.getDistrict(),"OPEN").forEach(r->routed.put(r.getId(),r));
        List<KrishiSevaKendra> owned=kendras.findByOwner_Id(ownerId).stream().filter(KrishiSevaKendra::isVerified).toList();
        owned.stream().map(KrishiSevaKendra::getCity).filter(city->city!=null&&!city.isBlank()).distinct()
                .forEach(city->requests.findByDistrictIgnoreCaseAndStatusOrderByCreatedAtDesc(city,"OPEN").forEach(r->routed.put(r.getId(),r)));
        return routed.values().stream().sorted(java.util.Comparator.comparing((FarmerProductRequest r)->owned.stream().noneMatch(k->k.getPostalCode()!=null&&k.getPostalCode().equals(r.getPostalCode())))
                .thenComparing(FarmerProductRequest::getCreatedAt,java.util.Comparator.reverseOrder())).map(this::response).toList();
    }

    @Transactional
    public FarmerRequestReplyResponse reply(UUID requestId, FarmerRequestReply input, UUID ownerId) {
        FarmerProductRequest request=requests.findById(requestId).orElseThrow(()->new NotFoundException("Request not found"));
        KrishiSevaKendra shop=kendras.findById(input.kendraId()).orElseThrow(()->new NotFoundException("Kendra not found"));
        if(!shop.getOwner().getId().equals(ownerId) || !shop.isVerified()) throw new AccessDeniedException("Only a verified owner of this centre can reply");
        if(!request.getDistrict().equalsIgnoreCase(shop.getCity()) && !request.getDistrict().equalsIgnoreCase(shop.getOwner().getDistrict())) throw new AccessDeniedException("This request is outside your registered district");
        FarmerProductRequestResponse reply=new FarmerProductRequestResponse(); reply.setRequest(request); reply.setOwner(shop.getOwner()); reply.setKendra(shop);
        reply.setAvailable(input.available()); reply.setPrice(input.available()?input.price():null); reply.setEta(input.eta().trim()); reply.setMessage(input.message());
        return replyDto(responses.save(reply));
    }

    private FarmerRequestResponse response(FarmerProductRequest request) {
        return new FarmerRequestResponse(request.getId(),request.getProductName(),request.getQuantityDescription(),request.getVillage(),request.getDistrict(),request.getPostalCode(),request.getImageUrl(),request.getStatus(),request.getCreatedAt(),responses.findByRequest_IdOrderByCreatedAtDesc(request.getId()).stream().map(this::replyDto).toList());
    }
    private FarmerRequestReplyResponse replyDto(FarmerProductRequestResponse response) {
        return new FarmerRequestReplyResponse(response.getId(),response.getKendra().getShopName(),response.getKendra().getCity(),response.isAvailable(),response.getPrice(),response.getEta(),response.getMessage(),response.getCreatedAt());
    }
}
