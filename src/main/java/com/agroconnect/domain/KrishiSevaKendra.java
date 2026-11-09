package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity @Table(name="krishi_seva_kendras", indexes=@Index(name="ix_kendra_owner", columnList="owner_id"))
@Getter @Setter @NoArgsConstructor
public class KrishiSevaKendra {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="shop_name", nullable=false, length=140) private String shopName;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="owner_id", nullable=false) private User owner;
    @Column(length=20) private String gstin;
    @Column(nullable=false, length=300) private String address;
    @Column(name="contact_number", nullable=false, length=20) private String contactNumber;
    @Column(precision=10, scale=7) private BigDecimal latitude;
    @Column(precision=10, scale=7) private BigDecimal longitude;
    @Column(name="is_verified", nullable=false) private boolean verified;
    @Column(name="owner_license_number", length=100) private String ownerLicenseNumber;
    @Column(length=100) private String city;
    @Column(name="photo_url", length=1000) private String photoUrl;
    @Column(name="business_type", nullable=false, length=20) private String businessType="KENDRA";
    @Column(name="document_url", length=1000) private String documentUrl;
    @Column(name="service_summary", length=1000) private String serviceSummary;
    @Column(name="postal_code", length=6) private String postalCode;
    @Enumerated(EnumType.STRING) @Column(name="verification_status", nullable=false, length=20) private VerificationStatus verificationStatus=VerificationStatus.PENDING;
    @Column(name="created_at", nullable=false, updatable=false) private java.time.Instant createdAt;
    @PrePersist void onCreate() { createdAt=java.time.Instant.now(); }
}
