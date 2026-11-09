package com.agroconnect.repository;
import com.agroconnect.domain.KrishiSevaKendra;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.math.BigDecimal;
import java.util.List;
public interface KendraRepository extends JpaRepository<KrishiSevaKendra, UUID> {
    List<KrishiSevaKendra> findByOwner_Id(UUID ownerId);
    List<KrishiSevaKendra> findByVerifiedFalse();
    @org.springframework.data.jpa.repository.Query("select k from KrishiSevaKendra k where k.verified = true and (lower(k.address) like lower(concat('%', :query, '%')) or lower(coalesce(k.city,'')) like lower(concat('%', :query, '%')) or lower(coalesce(k.postalCode,'')) like lower(concat('%', :query, '%')))")
    List<KrishiSevaKendra> searchVerifiedByArea(@org.springframework.data.repository.query.Param("query") String query);
    List<KrishiSevaKendra> findByLatitudeBetweenAndLongitudeBetween(BigDecimal minLatitude, BigDecimal maxLatitude, BigDecimal minLongitude, BigDecimal maxLongitude);
}


