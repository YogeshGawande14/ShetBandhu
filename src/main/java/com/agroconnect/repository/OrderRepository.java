package com.agroconnect.repository;
import com.agroconnect.domain.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;
public interface OrderRepository extends JpaRepository<PurchaseOrder, UUID> {
    Page<PurchaseOrder> findByFarmer_Id(UUID farmerId, Pageable pageable);
    Page<PurchaseOrder> findByShop_Owner_Id(UUID ownerId, Pageable pageable);
    boolean existsByFarmer_IdAndStatusAndItems_Product_Id(UUID farmerId, com.agroconnect.domain.OrderStatus status, UUID productId);
}
