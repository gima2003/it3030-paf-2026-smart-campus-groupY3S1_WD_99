package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    List<UserNotification> findByNotification(com.smartcampus.smart_campus_api.entity.AdminNotification notification);

    @Query("SELECT un FROM UserNotification un WHERE un.recipientUserId = :userId AND un.isDeleted = false " +
           "AND un.notification.status IN ('SENT') AND (un.notification.startDate IS NULL OR un.notification.startDate <= CURRENT_TIMESTAMP) " +
           "AND (un.notification.expiryDate IS NULL OR un.notification.expiryDate >= CURRENT_TIMESTAMP) ORDER BY un.notification.pinned DESC, un.notification.createdAt DESC")
    List<UserNotification> findAllActiveForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(un) FROM UserNotification un WHERE un.recipientUserId = :userId AND un.isRead = false AND un.isDeleted = false " +
           "AND un.notification.status IN ('SENT') AND (un.notification.startDate IS NULL OR un.notification.startDate <= CURRENT_TIMESTAMP) " +
           "AND (un.notification.expiryDate IS NULL OR un.notification.expiryDate >= CURRENT_TIMESTAMP)")
    Long countUnreadForUser(@Param("userId") Long userId);
}
