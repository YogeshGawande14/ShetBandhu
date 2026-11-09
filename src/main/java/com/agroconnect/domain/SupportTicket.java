package com.agroconnect.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="support_tickets", indexes=@Index(name="ix_support_ticket_status_created",columnList="status,created_at"))
@Getter @Setter @NoArgsConstructor
public class SupportTicket {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
    @Column(nullable=false,length=120) private String subject;
    @Column(nullable=false,length=2000) private String message;
    @Column(nullable=false,length=20) private String status="OPEN";
    @Column(name="admin_reply",length=2000) private String adminReply;
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
    @Column(name="updated_at",nullable=false) private Instant updatedAt;
    @PrePersist void create(){createdAt=Instant.now();updatedAt=createdAt;}
    @PreUpdate void update(){updatedAt=Instant.now();}
}
