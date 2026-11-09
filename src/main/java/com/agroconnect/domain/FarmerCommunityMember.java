package com.agroconnect.domain;
import jakarta.persistence.*;import lombok.Getter;import lombok.NoArgsConstructor;import lombok.Setter;import java.time.Instant;import java.util.UUID;
@Entity @Table(name="farmer_community_members",uniqueConstraints=@UniqueConstraint(name="uq_community_member",columnNames={"group_id","user_id"}),indexes=@Index(name="ix_community_member_user",columnList="user_id,joined_at")) @Getter @Setter @NoArgsConstructor
public class FarmerCommunityMember {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="group_id",nullable=false) private FarmerCommunityGroup group;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(name="joined_at",nullable=false,updatable=false) private Instant joinedAt;
 @PrePersist void create(){joinedAt=Instant.now();}
}