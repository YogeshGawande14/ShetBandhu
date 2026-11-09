package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity @Table(name="mandi_rates", indexes={@Index(name="ix_rate_market_date", columnList="mandi_name, record_date"), @Index(name="ix_rate_crop", columnList="crop_name")})
@Getter @Setter @NoArgsConstructor
public class MandiRate {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Enumerated(EnumType.STRING) @Column(name="crop_name", nullable=false, length=20) private CropType cropName;
    @Column(name="mandi_name", nullable=false, length=140) private String mandiName;
    @Column(nullable=false, precision=12, scale=2) private BigDecimal ratePerQuintal;
    @Column(name="min_rate", nullable=false, precision=12, scale=2) private BigDecimal minRate;
    @Column(name="max_rate", nullable=false, precision=12, scale=2) private BigDecimal maxRate;
    @Column(name="transport_cost_per_qtl", nullable=false, precision=12, scale=2) private BigDecimal transportCostPerQtl;
    @Column(length=100) private String district;
    @Column(length=100) private String tehsil;
    @Column(length=100) private String city;
    @Column(name="is_auto_fetched", nullable=false) private boolean autoFetched;
    @Column(name="source_label", nullable=false, length=30) private String sourceLabel="ADMIN_REPORTED";
    @Column(name="record_date", nullable=false) private LocalDate recordDate;
}
