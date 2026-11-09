package com.agroconnect.domain;
import jakarta.persistence.*;import lombok.Getter;import lombok.NoArgsConstructor;import lombok.Setter;import java.time.Instant;import java.util.UUID;
@Entity @Table(name="farmer_community_groups",indexes=@Index(name="ix_community_active_locality",columnList="active,locality")) @Getter @Setter @NoArgsConstructor
public class FarmerCommunityGroup {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @Column(nullable=false,length=120) private String name;
 @Column(nullable=false,length=1000) private String description;
 @Column(length=160) private String locality;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="created_by") private User createdBy;
 @Column(nullable=false) private boolean active=true;
 @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
 @PrePersist void create(){createdAt=Instant.now();}
}