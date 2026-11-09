package com.agroconnect.repository;

import com.agroconnect.domain.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProductReviewRepository extends JpaRepository<ProductReview,UUID> {
    List<ProductReview> findByProduct_IdOrderByCreatedAtDesc(UUID productId);
    boolean existsByProduct_IdAndCustomer_Id(UUID productId,UUID customerId);
}
