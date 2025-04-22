package com.hrapp.model;


import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "incede_interns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Interns {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String internId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String status; // Paid / Unpaid

    @Temporal(TemporalType.DATE)
    private Date joiningDate;

    @Temporal(TemporalType.DATE)
    private Date birthDate;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String contactNo;

    private double leaveCount = 0.0; // Number of leaves taken
    private double lopCount = 0.0;   // Loss of Pay Count
    private int presence = 0;        //0=active, 1=inactive
}
