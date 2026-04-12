package com.smartcampus.smart_campus_api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_notifications")
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "notification_id", nullable = false)
    private AdminNotification notification;

    @Column(nullable = false)
    private Long recipientUserId;

    private Boolean isRead = false;

    private LocalDateTime readAt;

    private Boolean isDeleted = false;

    private LocalDateTime deliveredAt = LocalDateTime.now();

    public UserNotification() {
    }

    // Getters and Setters

    public Long getId() { return id; }

    public AdminNotification getNotification() { return notification; }
    public void setNotification(AdminNotification notification) { this.notification = notification; }

    public Long getRecipientUserId() { return recipientUserId; }
    public void setRecipientUserId(Long recipientUserId) { this.recipientUserId = recipientUserId; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }

    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
}
