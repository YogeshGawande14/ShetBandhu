package com.agroconnect.domain;
import jakarta.persistence.*;import lombok.Getter;import lombok.NoArgsConstructor;import lombok.Setter;import java.time.Instant;import java.util.UUID;
@Entity @Table(name="local_service_messages",indexes=@Index(name="ix_service_message_thread",columnList="thread_id,created_at")) @Getter @Setter @NoArgsConstructor
public class LocalServiceMessage {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="thread_id",nullable=false) private LocalServiceContactThread thread;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="sender_id",nullable=false) private User sender;
 @Column(nullable=false,length=2000) private String message;
 @Column(name="delivered_at") private Instant deliveredAt;
 @Column(name="read_at") private Instant readAt;
 @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
 @PrePersist void create(){createdAt=Instant.now();}
}
