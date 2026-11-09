package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.ProductReviewRequest;
import com.agroconnect.api.dto.ApiDtos.ProductReviewResponse;
import com.agroconnect.api.dto.ApiDtos.ProductReviewSummary;
import com.agroconnect.domain.*;
import com.agroconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class ProductReviewService {
    private final ProductReviewRepository reviews;
    private final ProductRepository products;
    private final UserRepository users;
    private final OrderRepository orders;
    @Transactional(readOnly=true) public ProductReviewSummary list(UUID productId){if(!products.existsById(productId))throw new NotFoundException("Product not found");List<ProductReviewResponse> items=reviews.findByProduct_IdOrderByCreatedAtDesc(productId).stream().map(this::response).toList();BigDecimal avg=items.isEmpty()?BigDecimal.ZERO:BigDecimal.valueOf(items.stream().mapToInt(ProductReviewResponse::rating).average().orElse(0)).setScale(1,RoundingMode.HALF_UP);return new ProductReviewSummary(avg,items.size(),items);}
    @Transactional public ProductReviewResponse create(UUID productId,UUID customerId,ProductReviewRequest input){AgriProduct product=products.findById(productId).orElseThrow(()->new NotFoundException("Product not found"));User customer=users.findById(customerId).orElseThrow(()->new NotFoundException("Customer not found"));if(!orders.existsByFarmer_IdAndStatusAndItems_Product_Id(customerId,OrderStatus.DELIVERED,productId))throw new BadRequestException("A review is available after this product has been delivered to you");if(reviews.existsByProduct_IdAndCustomer_Id(productId,customerId))throw new ConflictException("You have already reviewed this product");ProductReview review=new ProductReview();review.setProduct(product);review.setCustomer(customer);review.setRating(input.rating());review.setComment(input.comment().trim());try{return response(reviews.save(review));}catch(DataIntegrityViolationException ex){throw new ConflictException("You have already reviewed this product");}}
    private ProductReviewResponse response(ProductReview r){String name=r.getCustomer().getFullName();String[] parts=name.trim().split("\\s+");String masked=parts.length>1?parts[0]+" "+parts[parts.length-1].substring(0,1)+".":parts[0];return new ProductReviewResponse(r.getId(),r.getProduct().getId(),masked,r.getRating(),r.getComment(),r.getCreatedAt());}
}
