package com.agroconnect.repository;

import com.agroconnect.domain.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SupportTicketRepository extends JpaRepository<SupportTicket,UUID> {
    List<SupportTicket> findByUser_IdOrderByCreatedAtDesc(UUID userId);
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}
