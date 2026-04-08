package com.smartcampus.smart_campus_api.dto;

import com.smartcampus.smart_campus_api.enums.BatchYear;
import com.smartcampus.smart_campus_api.enums.Department;
import com.smartcampus.smart_campus_api.enums.Designation;
import com.smartcampus.smart_campus_api.enums.Faculty;

public class UpdateUserAdminRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String city;
    private Boolean isActive;

    private BatchYear batchYear;
    private Faculty faculty;
    private Department department;
    private String specialization;
    private Designation designation;
    private String officeLocation;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public BatchYear getBatchYear() { return batchYear; }
    public void setBatchYear(BatchYear batchYear) { this.batchYear = batchYear; }

    public Faculty getFaculty() { return faculty; }
    public void setFaculty(Faculty faculty) { this.faculty = faculty; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Designation getDesignation() { return designation; }
    public void setDesignation(Designation designation) { this.designation = designation; }

    public String getOfficeLocation() { return officeLocation; }
    public void setOfficeLocation(String officeLocation) { this.officeLocation = officeLocation; }
}
