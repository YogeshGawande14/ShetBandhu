package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="farmer_product_request_responses")
@Getter @Setter @NoArgsConstructor
public class FarmerProductRequestResponse {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="request_id",nullable=false) private FarmerProductRequest request;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="owner_id",nullable=false) private User owner;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="kendra_id",nullable=false) private KrishiSevaKendra kendra;
    @Column(nullable=false) private boolean available;
    @Column(precision=12,scale=2) private BigDecimal price;
    @Column(nullable=false,length=100) private String eta;
    @Column(length=500) private String message;
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
    @PrePersist void create(){createdAt=Instant.now();}
}
