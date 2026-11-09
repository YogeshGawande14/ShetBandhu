package com.agroconnect.repository;
import com.agroconnect.domain.FarmerCommunityMessage;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;import java.util.UUID;
public interface FarmerCommunityMessageRepository extends JpaRepository<FarmerCommunityMessage,UUID>{List<FarmerCommunityMessage> findTop100ByGroup_IdOrderByCreatedAtDesc(UUID groupId);}