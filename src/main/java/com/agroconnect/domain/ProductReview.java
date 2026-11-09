package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="product_reviews",uniqueConstraints=@UniqueConstraint(name="uq_product_review_customer",columnNames={"product_id","customer_id"}),indexes=@Index(name="ix_product_review_created",columnList="product_id,created_at"))
@Getter @Setter @NoArgsConstructor
public class ProductReview {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="product_id",nullable=false) private AgriProduct product;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="customer_id",nullable=false) private User customer;
    @Column(nullable=false) private int rating;
    @Column(nullable=false,length=1200) private String comment;
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
    @PrePersist void onCreate(){createdAt=Instant.now();}
}
