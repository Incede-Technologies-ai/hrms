package com.hrapp.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "employees")

public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String employeeId;
    private String fullName;
    private String designation;
    private String department;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate joiningDate;
    
    private String officialEmail;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    private String contactNo;
    private String personalEmail;
    
    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt;
    
    @Column(name = "updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate updatedAt;

    @Column(name = "normal_leave_balance", nullable = false)
    private Double leaves = 0.0;

    @Column(name = "sick_leave_balance", nullable = false)
    private Double sickLeaves = 5.0; // Default value

    @Column(name = "lop_count", nullable = false)
    private Double lopCount = 0.0;
    
    private boolean active = true; // Default is active


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
        updatedAt = LocalDate.now();
        active = true;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }

}
