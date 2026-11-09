package com.agroconnect.domain;
import jakarta.persistence.*;import lombok.Getter;import lombok.NoArgsConstructor;import lombok.Setter;import java.time.Instant;import java.util.UUID;
@Entity @Table(name="farmer_community_messages",indexes=@Index(name="ix_community_message_group",columnList="group_id,created_at")) @Getter @Setter @NoArgsConstructor
public class FarmerCommunityMessage {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="group_id",nullable=false) private FarmerCommunityGroup group;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="sender_id",nullable=false) private User sender;
 @Column(nullable=false,length=2000) private String message;
 @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
 @PrePersist void create(){createdAt=Instant.now();}
}