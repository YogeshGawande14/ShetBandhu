package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name="users", indexes=@Index(name="ux_users_phone", columnList="phone_number", unique=true))
@Getter @Setter @NoArgsConstructor
public class User {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="full_name", nullable=false, length=120) private String fullName;
    @Column(name="phone_number", nullable=false, unique=true, length=20) private String phoneNumber;
    @Column(name="email", unique=true, length=254) private String email;
    @Column(name="email_verified", nullable=false) private boolean emailVerified;
    @Column(name="password_hash", nullable=false, length=100) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(name="role", nullable=false, length=20) private Role role;
    @ElementCollection(fetch=FetchType.EAGER)
    @CollectionTable(name="user_roles", joinColumns=@JoinColumn(name="user_id"))
    @Column(name="role", nullable=false, length=20)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();
    @Column(name="profile_photo_url",length=1000) private String profilePhotoUrl;
    @Column(length=100) private String village;
    @Column(length=100) private String district;
    @Column(precision=10, scale=7) private BigDecimal latitude;
    @Column(precision=10, scale=7) private BigDecimal longitude;
    @Column(name="is_approved", nullable=false) private boolean approved=true;
    @Column(name="account_enabled", nullable=false) private boolean accountEnabled=true;
    @Column(name="token_version", nullable=false) private int tokenVersion;
    @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
    @PrePersist void onCreate() { createdAt=Instant.now(); }
}
