package com.agroconnect.repository;

import com.agroconnect.domain.FarmerProductRequestResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface FarmerProductRequestResponseRepository extends JpaRepository<FarmerProductRequestResponse, UUID> {
    List<FarmerProductRequestResponse> findByRequest_IdOrderByCreatedAtDesc(UUID requestId);
    List<FarmerProductRequestResponse> findByOwner_IdOrderByCreatedAtDesc(UUID ownerId);
}
