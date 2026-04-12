package com.smartcampus.smart_campus_api.repository;

import com.smartcampus.smart_campus_api.entity.AdminNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminNotificationRepository extends JpaRepository<AdminNotification, Long> {
}
