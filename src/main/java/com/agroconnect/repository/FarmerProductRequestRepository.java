package com.agroconnect.repository;

import com.agroconnect.domain.FarmerProductRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface FarmerProductRequestRepository extends JpaRepository<FarmerProductRequest, UUID> {
    List<FarmerProductRequest> findByFarmer_IdOrderByCreatedAtDesc(UUID farmerId);
    List<FarmerProductRequest> findByDistrictIgnoreCaseAndStatusOrderByCreatedAtDesc(String district, String status);
}
