package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="local_service_listings", indexes={@Index(name="ix_local_service_area",columnList="active,district,taluka"),@Index(name="ix_local_service_owner",columnList="owner_id,active")})
@Getter @Setter @NoArgsConstructor
public class LocalServiceListing {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="owner_id",nullable=false) private User owner;
 @Column(name="listing_type",nullable=false,length=20) private String listingType;
 @Column(nullable=false,length=50) private String category;
 @Column(nullable=false,length=160) private String title;
 @Column(nullable=false,length=2000) private String description;
 @Column(name="image_url",nullable=false,length=1000) private String imageUrl;
 @Column(nullable=false,precision=12,scale=2) private BigDecimal price;
 @Column(name="rate_unit",nullable=false,length=20) private String rateUnit;
 @Column(name="rate_notes",length=500) private String rateNotes;
 @Column(name="contact_number",length=20) private String contactNumber;
 @Column(name="allow_calls",nullable=false) private boolean allowCalls;
 @Column(name="allow_whatsapp",nullable=false) private boolean allowWhatsApp;
 @Column(nullable=false,length=120) private String village;
 @Column(nullable=false,length=120) private String taluka;
 @Column(nullable=false,length=120) private String district;
 @Column(nullable=false,precision=10,scale=7) private BigDecimal latitude;
 @Column(nullable=false,precision=10,scale=7) private BigDecimal longitude;
 @Column(nullable=false,length=500) private String availability;
 @Column(nullable=false) private boolean active=true;
 @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
 @Column(name="updated_at",nullable=false) private Instant updatedAt;
 @PrePersist void create(){createdAt=updatedAt=Instant.now();}
 @PreUpdate void update(){updatedAt=Instant.now();}
}
