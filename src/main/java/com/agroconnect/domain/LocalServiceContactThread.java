package com.agroconnect.domain;
import jakarta.persistence.*;import lombok.Getter;import lombok.NoArgsConstructor;import lombok.Setter;import java.math.BigDecimal;import java.time.Instant;import java.time.LocalDate;import java.util.UUID;
@Entity @Table(name="local_service_contact_threads",uniqueConstraints=@UniqueConstraint(name="uq_service_thread_request",columnNames={"listing_id","requester_id"}),indexes=@Index(name="ix_service_thread_provider",columnList="provider_id,status,updated_at")) @Getter @Setter @NoArgsConstructor
public class LocalServiceContactThread {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="listing_id",nullable=false) private LocalServiceListing listing;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="requester_id",nullable=false) private User requester;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="provider_id",nullable=false) private User provider;
 @Column(name="requested_date") private LocalDate requestedDate;
 @Column(name="area_acres",precision=8,scale=2) private BigDecimal areaAcres;
 @Column(nullable=false,length=20) private String status="OPEN";
 @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
 @Column(name="updated_at",nullable=false) private Instant updatedAt;
 @PrePersist void create(){createdAt=updatedAt=Instant.now();}@PreUpdate void update(){updatedAt=Instant.now();}
}