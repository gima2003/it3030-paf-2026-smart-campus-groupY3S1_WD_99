package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.enums.NotificationPriority;
import com.smartcampus.smart_campus_api.enums.NotificationType;
import com.smartcampus.smart_campus_api.enums.TargetAudienceType;

import java.time.LocalDateTime;

public class CreateNotificationRequest {
    private String title;
    private String message;
    private NotificationType type;
    private NotificationPriority priority;
    private TargetAudienceType targetAudience;
    private String specificRole;
    private String specificIdentifier;
    private String actionUrl;
    private Boolean pinned;
    private LocalDateTime startDate;
    private LocalDateTime expiryDate;
    private Boolean sendImmediately;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public NotificationPriority getPriority() { return priority; }
    public void setPriority(NotificationPriority priority) { this.priority = priority; }

    public TargetAudienceType getTargetAudience() { return targetAudience; }
    public void setTargetAudience(TargetAudienceType targetAudience) { this.targetAudience = targetAudience; }

    public String getSpecificRole() { return specificRole; }
    public void setSpecificRole(String specificRole) { this.specificRole = specificRole; }

    public String getSpecificIdentifier() { return specificIdentifier; }
    public void setSpecificIdentifier(String specificIdentifier) { this.specificIdentifier = specificIdentifier; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public Boolean getPinned() { return pinned; }
    public void setPinned(Boolean pinned) { this.pinned = pinned; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public Boolean getSendImmediately() { return sendImmediately; }
    public void setSendImmediately(Boolean sendImmediately) { this.sendImmediately = sendImmediately; }
}
