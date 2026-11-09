package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="agri_products", indexes={@Index(name="ix_product_shop", columnList="shop_id"), @Index(name="ix_product_name", columnList="name")})
@Getter @Setter @NoArgsConstructor
public class AgriProduct {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="shop_id", nullable=false) private KrishiSevaKendra shop;
    @Column(name="product_name", nullable=false, length=140) private String productName;
    @Enumerated(EnumType.STRING) @Column(length=30) private ProductCategory category;
    @Column(length=1000) private String description;
    @Column(nullable=false, precision=12, scale=2) private BigDecimal price;
    @Column(nullable=false, length=20) private String unit;
    @Column(nullable=false) private int stockQuantity;
    @Column(nullable=false) private boolean active=true;
    @Column(name="audio_description_url", length=1000) private String audioDescriptionUrl;
    @Column(name="image_url", length=1000) private String imageUrl;
    @Column(name="admin_removed", nullable=false) private boolean adminRemoved;
    @Column(name="moderation_reason", length=500) private String moderationReason;
    @Column(name="admin_moderated_by", length=36, columnDefinition="char(36)") private String adminModeratedBy;
    @Column(name="moderated_at") private Instant moderatedAt;
    @Version private long version;
    @Column(nullable=false, updatable=false) private Instant createdAt;
    @PrePersist void onCreate() { createdAt=Instant.now(); }
}
