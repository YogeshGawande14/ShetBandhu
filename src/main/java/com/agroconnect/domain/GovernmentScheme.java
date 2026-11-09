package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="government_schemes", indexes=@Index(name="ix_scheme_state_active", columnList="state,active"))
@Getter @Setter @NoArgsConstructor
public class GovernmentScheme {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false,length=180) private String title;
    @Column(nullable=false,length=3000) private String description;
    @Column(nullable=false,length=2000) private String eligibility;
    @Column(name="title_mr",length=180) private String titleMr;
    @Column(name="description_mr",length=3000) private String descriptionMr;
    @Column(name="eligibility_mr",length=2000) private String eligibilityMr;
    @Column(name="official_url",nullable=false,length=1000) private String officialUrl;
    @Column(length=100) private String state;
    @Column(nullable=false) private boolean active=true;
    @Column(name="updated_at",nullable=false) private Instant updatedAt;
    @PrePersist @PreUpdate void updateTimestamp(){updatedAt=Instant.now();}
}
