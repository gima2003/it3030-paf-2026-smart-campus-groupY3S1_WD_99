package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.enums.NotificationPriority;
import com.smartcampus.smart_campus_api.enums.NotificationType;
import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private Long notificationId;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationPriority priority;
    private String actionUrl;
    private Boolean pinned;
    private LocalDateTime createdAt;
    private Boolean isRead;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public NotificationPriority getPriority() { return priority; }
    public void setPriority(NotificationPriority priority) { this.priority = priority; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public Boolean getPinned() { return pinned; }
    public void setPinned(Boolean pinned) { this.pinned = pinned; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
}
