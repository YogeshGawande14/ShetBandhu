package com.agroconnect.repository;
import com.agroconnect.domain.LocalServiceMessage;import org.springframework.data.jpa.repository.JpaRepository;import org.springframework.data.jpa.repository.Modifying;import org.springframework.data.jpa.repository.Query;import org.springframework.data.repository.query.Param;import java.time.Instant;import java.util.List;import java.util.UUID;
public interface LocalServiceMessageRepository extends JpaRepository<LocalServiceMessage,UUID>{
 List<LocalServiceMessage> findTop100ByThread_IdOrderByCreatedAtDesc(UUID threadId);
 @Query("select count(m) from LocalServiceMessage m where m.thread.id=:threadId and m.sender.id<>:userId and m.readAt is null") long countUnread(@Param("threadId") UUID threadId,@Param("userId") UUID userId);
 @Modifying @Query("update LocalServiceMessage m set m.deliveredAt=:deliveredAt where m.thread.id=:threadId and m.sender.id<>:userId and m.deliveredAt is null") int markIncomingDelivered(@Param("threadId") UUID threadId,@Param("userId") UUID userId,@Param("deliveredAt") Instant deliveredAt);
 @Modifying @Query("update LocalServiceMessage m set m.readAt=:readAt where m.thread.id=:threadId and m.sender.id<>:userId and m.readAt is null") int markIncomingRead(@Param("threadId") UUID threadId,@Param("userId") UUID userId,@Param("readAt") Instant readAt);
}
