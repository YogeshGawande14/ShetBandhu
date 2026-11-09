package com.agroconnect.repository;
import com.agroconnect.domain.FarmerCommunityGroup;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;import java.util.UUID;
public interface FarmerCommunityGroupRepository extends JpaRepository<FarmerCommunityGroup,UUID>{List<FarmerCommunityGroup> findByActiveTrueOrderByNameAsc();}