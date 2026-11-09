package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity @Table(name="order_items")
@Getter @Setter @NoArgsConstructor
public class OrderItem {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="order_id", nullable=false) private PurchaseOrder order;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="product_id", nullable=false) private AgriProduct product;
    @Column(nullable=false) private int quantity;
    @Column(name="unit_price", nullable=false, precision=12, scale=2) private BigDecimal unitPrice;
    @Column(nullable=false, precision=12, scale=2) private BigDecimal lineTotal;
}
