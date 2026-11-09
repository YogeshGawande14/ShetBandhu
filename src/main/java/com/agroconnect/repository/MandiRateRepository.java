package com.agroconnect.repository;
import com.agroconnect.domain.MandiRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;
import java.util.UUID;
public interface MandiRateRepository extends JpaRepository<MandiRate, UUID>, JpaSpecificationExecutor<MandiRate> {
    java.util.List<MandiRate> findByCropNameAndRecordDateLessThanEqualOrderByRecordDateDesc(com.agroconnect.domain.CropType cropName, java.time.LocalDate recordDate);
    Optional<MandiRate> findTopByCropNameAndMandiNameIgnoreCaseOrderByRecordDateDesc(com.agroconnect.domain.CropType cropName, String mandiName);
    Optional<MandiRate> findTopByCropNameAndMandiNameIgnoreCaseAndRecordDateLessThanOrderByRecordDateDesc(com.agroconnect.domain.CropType cropName, String mandiName, java.time.LocalDate recordDate);
}
