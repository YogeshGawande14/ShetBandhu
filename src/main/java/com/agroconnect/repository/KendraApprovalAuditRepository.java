package com.agroconnect.repository;

import com.agroconnect.domain.KendraApprovalAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface KendraApprovalAuditRepository extends JpaRepository<KendraApprovalAudit, UUID> {}
