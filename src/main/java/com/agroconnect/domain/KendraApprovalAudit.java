package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "kendra_approval_audits", indexes = @Index(name = "ix_kendra_approval_audit_shop_time", columnList = "kendra_id,created_at"))
@Getter @Setter @NoArgsConstructor
public class KendraApprovalAudit {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "kendra_id", nullable = false, length = 36) private UUID kendraId;
    @Column(name = "admin_user_id", nullable = false, length = 36) private UUID adminUserId;
    @Column(name = "documents_missing", nullable = false) private boolean documentsMissing;
    @Column(nullable = false, length = 500) private String reason;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @PrePersist void onCreate() { createdAt = Instant.now(); }
}
