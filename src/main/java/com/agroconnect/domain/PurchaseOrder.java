package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Entity @Table(name="purchase_orders", indexes=@Index(name="ix_order_farmer", columnList="farmer_id"))
@Getter @Setter @NoArgsConstructor
public class PurchaseOrder {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="farmer_id") private User farmer;
    @Column(name="customer_name", length=120) private String customerName;
    @Column(name="contact_phone", length=20) private String contactPhone;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="shop_id", nullable=false) private KrishiSevaKendra shop;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=30) private DeliveryType deliveryType=DeliveryType.SHOP_PICKUP;
    @Column(name="delivery_address", length=500) private String deliveryAddress;
    @Column(name="delivery_address_required", nullable=false) private boolean deliveryAddressRequired;
    @Column(name="postal_code", length=6, columnDefinition="CHAR(6)") private String postalCode;
    @Column(name="delivery_city", length=120) private String deliveryCity;
    @Column(name="delivery_district", length=120) private String deliveryDistrict;
    @Column(name="delivery_state", length=120) private String deliveryState;
    @Column(name="delivery_landmark", length=180) private String deliveryLandmark;
    @Column(name="guest_access_token_hash", length=64, columnDefinition="CHAR(64)") private String guestAccessTokenHash;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private OrderStatus status=OrderStatus.PENDING;
    @Column(name="total_amount", nullable=false, precision=12, scale=2) private BigDecimal totalAmount;
    @Column(name="voice_audio_url", length=1000) private String voiceAudioUrl;
    @Column(name="voice_transcript", length=2000) private String voiceTranscript;
    @Column(nullable=false, updatable=false) private Instant createdAt;
    @Version private long version;
    @OneToMany(mappedBy="order", cascade=CascadeType.ALL, orphanRemoval=true) private List<OrderItem> items=new ArrayList<>();
    @PrePersist void onCreate() { createdAt=Instant.now(); }
    public void addItem(OrderItem item) { items.add(item); item.setOrder(this); }
}
