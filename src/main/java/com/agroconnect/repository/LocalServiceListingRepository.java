package com.agroconnect.repository;
import com.agroconnect.domain.LocalServiceListing;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;import java.util.UUID;
public interface LocalServiceListingRepository extends JpaRepository<LocalServiceListing,UUID>{List<LocalServiceListing> findByActiveTrueOrderByCreatedAtDesc();List<LocalServiceListing> findByOwner_IdAndActiveTrueOrderByUpdatedAtDesc(UUID ownerId);}
