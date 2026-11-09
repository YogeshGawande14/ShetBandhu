package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="farmer_product_requests", indexes=@Index(name="ix_product_requests_area", columnList="district,status,created_at"))
@Getter @Setter @NoArgsConstructor
public class FarmerProductRequest {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="farmer_id",nullable=false) private User farmer;
    @Column(name="product_name",nullable=false,length=140) private String productName;
    @Column(name="quantity_description",nullable=false,length=120) private String quantityDescription;
    @Column(nullable=false,length=100) private String village;
    @Column(nullable=false,length=100) private String district;
    @Column(name="postal_code",length=6) private String postalCode;
    @Column(name="image_url",length=1000) private String imageUrl;
    @Column(nullable=false,length=20) private String status="OPEN";
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
    @PrePersist void create(){createdAt=Instant.now();}
}
