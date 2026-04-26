# 🎓 Smart Campus 360

A full-stack web application designed to manage university operations including resource booking, ticket management, and notifications.

---

## 📌 Project Overview

Smart Campus 360 is a centralized platform that allows students, lecturers, administrators, and technicians to:

- Book university resources (labs, rooms, equipment)
- Report maintenance issues
- Track ticket status
- Receive real-time notifications
- Manage users and technicians (Admin)

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React (Vite)
- Tailwind CSS

### 🔹 Backend
- Spring Boot (Java)
- REST API

### 🔹 Database
- MySQL

### 🔹 Authentication
- Google OAuth 2.0
- JWT Token-based security

---

## 👥 User Roles

- 👨‍🎓 Student
- 👩‍🏫 Lecturer
- 🛠️ Technician
- 🧑‍💼 Admin

---

## ⚙️ Features

### 🔹 Module A – Resource Management
- Add / update facilities and equipment
- Search and filter resources

### 🔹 Module B – Booking System
- Create bookings
- Conflict detection
- Admin approval/rejection

### 🔹 Module C – Ticket Management (Your Module)
- Create tickets with image attachments
- Assign technicians
- Update ticket status (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- Add comments
- SLA-based deadline tracking

### 🔹 Module D – Notifications
- Booking updates
- Ticket status changes
- Admin announcements

---


## 🔐 Authentication

- Google OAuth login is used for authentication
- JWT tokens are used for securing API requests

---

## 🧪 Testing

Testing was conducted using:
- Browser Developer Tools (Network tab)
- UI-based testing
- Functional workflow testing

Example:
- Ticket creation via POST request
- Status update via PUT request
- Role-based access validation

---



