-- SQL to alter the existing users table to add common and role-specific fields
-- Run this script in your MySQL database to update the schema

ALTER TABLE users
    -- Common Fields
    ADD COLUMN first_name VARCHAR(100),
    ADD COLUMN last_name VARCHAR(100),
    ADD COLUMN phone VARCHAR(20),
    ADD COLUMN city VARCHAR(100),
    ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
    
    -- Student Specific Fields
    ADD COLUMN student_id VARCHAR(50),
    ADD COLUMN batch_year VARCHAR(20),
    ADD COLUMN faculty VARCHAR(50),
    
    -- Lecturer/Manager/Technician/Admin Employee ID
    ADD COLUMN employee_id VARCHAR(50),
    
    -- Shared Department Field
    ADD COLUMN department VARCHAR(50),
    
    -- Lecturer/Technician Specialization
    ADD COLUMN specialization VARCHAR(100),
    
    -- Lecturer Designation
    ADD COLUMN designation VARCHAR(50),
    
    -- Manager Office Location
    ADD COLUMN office_location VARCHAR(100),
    
    -- Admin Access Level
    ADD COLUMN access_level VARCHAR(50);
