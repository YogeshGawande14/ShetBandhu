package com.agroconnect.repository;

import com.agroconnect.domain.AccountEmailChallenge;
import com.agroconnect.domain.EmailChallengePurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.time.Instant;

import java.util.Optional;
import java.util.UUID;

public interface AccountEmailChallengeRepository extends JpaRepository<AccountEmailChallenge, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<AccountEmailChallenge> findTopByUser_IdAndPurposeOrderByCreatedAtDesc(UUID userId, EmailChallengePurpose purpose);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<AccountEmailChallenge> findByResetTokenHash(String resetTokenHash);
    long countByUser_IdAndPurposeAndCreatedAtAfter(UUID userId, EmailChallengePurpose purpose, Instant createdAt);
}
