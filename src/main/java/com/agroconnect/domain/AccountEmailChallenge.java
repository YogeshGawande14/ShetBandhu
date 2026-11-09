package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "account_email_challenges", indexes = {
        @Index(name = "ix_account_email_challenge_user_purpose", columnList = "user_id,purpose"),
        @Index(name = "ix_account_email_challenge_expiry", columnList = "expires_at")
})
@Getter
@Setter
@NoArgsConstructor
public class AccountEmailChallenge {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 254)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private EmailChallengePurpose purpose;

    @Column(name = "code_hash", nullable = false, length = 100)
    private String codeHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "reset_token_hash", length = 64, columnDefinition = "char(64)")
    private String resetTokenHash;

    @Column(name = "reset_token_expires_at")
    private Instant resetTokenExpiresAt;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "consumed_at")
    private Instant consumedAt;
}
