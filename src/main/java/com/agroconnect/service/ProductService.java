package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.api.mapper.AgroMapper;
import com.agroconnect.domain.*;
import com.agroconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class ProductService {
    private final ProductRepository products; private final KendraRepository shops; private final AgroMapper mapper;
    @Transactional(readOnly=true)
    public Page<ProductResponse> list(String q, String category, Pageable pageable) {
        Specification<AgriProduct> spec=(root,query,cb)->cb.isTrue(root.get("active"));
        if(q!=null && !q.isBlank()) spec=spec.and((root,query,cb)->cb.like(cb.lower(root.get("productName")), "%"+q.toLowerCase()+"%"));
        if(category!=null && !category.isBlank()) spec=spec.and((root,query,cb)->cb.equal(cb.lower(root.get("category")), category.toLowerCase()));
        spec=spec.and((root,query,cb)->cb.isTrue(root.get("shop").get("verified")));
        return products.findAll(spec,pageable).map(mapper::product);
    }
    @Transactional(readOnly=true)
    public Page<ProductResponse> mine(UUID ownerId, Pageable pageable) {
        return products.findByShop_Owner_Id(ownerId,pageable).map(mapper::product);
    }
    @Transactional(readOnly=true)
    public Page<AdminProductResponse> adminList(String query, Pageable pageable) {
        Specification<AgriProduct> spec=(root,q,cb)->cb.conjunction();
        if(query!=null&&!query.isBlank()) spec=spec.and((root,q,cb)->cb.or(cb.like(cb.lower(root.get("productName")),"%"+query.trim().toLowerCase()+"%"),cb.like(cb.lower(root.get("shop").get("shopName")),"%"+query.trim().toLowerCase()+"%")));
        return products.findAll(spec,pageable).map(this::adminResponse);
    }
    @Transactional
    public AdminProductResponse moderate(UUID id, UUID adminId, boolean approved, String reason) {
        AgriProduct product=find(id);
        product.setAdminRemoved(!approved);
        product.setActive(approved);
        product.setModerationReason(approved?null:reason.trim());
        product.setAdminModeratedBy(adminId.toString());
        product.setModeratedAt(java.time.Instant.now());
        return adminResponse(product);
    }
    @Transactional(readOnly=true) public ProductResponse get(UUID id) { return mapper.product(find(id)); }
    @Transactional public ProductResponse create(ProductRequest req, UUID actorId) {
        AgriProduct p=mapper.product(req); p.setShop(shops.findById(req.shopId()).orElseThrow(()->new NotFoundException("Shop not found")));
        assertShopOwner(p.getShop(),actorId,false);
        return mapper.product(products.save(p));
    }
    @Transactional public ProductResponse update(UUID id, ProductRequest req, UUID actorId, boolean admin) {
        AgriProduct p=find(id); assertShopOwner(p.getShop(),actorId,admin);
        if(p.isAdminRemoved()&&!admin&&req.active()) throw new BadRequestException("This listing was removed by a Super Admin and cannot be reactivated by its owner");
        KrishiSevaKendra shop=shops.findById(req.shopId()).orElseThrow(()->new NotFoundException("Shop not found")); assertShopOwner(shop,actorId,admin);
        p.setShop(shop); p.setProductName(req.name()); p.setCategory(req.category()==null?null:ProductCategory.valueOf(req.category())); p.setDescription(req.description()); p.setPrice(req.price()); p.setUnit(req.unit()); p.setStockQuantity(req.stockQuantity()); p.setActive(req.active()); p.setAudioDescriptionUrl(req.audioDescriptionUrl()); p.setImageUrl(req.imageUrl());
        return mapper.product(p);
    }
    @Transactional public void delete(UUID id, UUID actorId, boolean admin) { AgriProduct p=find(id); assertShopOwner(p.getShop(),actorId,admin); p.setActive(false); }
    private AgriProduct find(UUID id) { return products.findById(id).orElseThrow(()->new NotFoundException("Product not found")); }
    private AdminProductResponse adminResponse(AgriProduct p) { return new AdminProductResponse(p.getId(),p.getProductName(),p.getShop().getShopName(),p.getShop().getOwner().getId(),p.getCategory()==null?null:p.getCategory().name(),p.getPrice(),p.getUnit(),p.getStockQuantity(),p.getImageUrl(),p.isActive(),p.isAdminRemoved(),p.getModerationReason(),p.getAdminModeratedBy(),p.getModeratedAt(),p.getCreatedAt()); }
    private void assertShopOwner(KrishiSevaKendra shop, UUID actorId, boolean admin) { if(!admin&&!shop.getOwner().getId().equals(actorId)) throw new org.springframework.security.access.AccessDeniedException("Only the shop owner can manage these products");
        if(!admin&&!shop.isVerified()) throw new org.springframework.security.access.AccessDeniedException("This Kendra must be verified before products can be listed"); }
}

