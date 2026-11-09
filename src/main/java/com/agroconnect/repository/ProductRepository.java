package com.agroconnect.repository;
import com.agroconnect.domain.AgriProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
public interface ProductRepository extends JpaRepository<AgriProduct, UUID>, JpaSpecificationExecutor<AgriProduct> {
    org.springframework.data.domain.Page<AgriProduct> findByShop_Owner_Id(UUID ownerId, org.springframework.data.domain.Pageable pageable);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from AgriProduct p join fetch p.shop where p.id = :id")
    Optional<AgriProduct> findByIdForCheckout(@Param("id") UUID id);
}
