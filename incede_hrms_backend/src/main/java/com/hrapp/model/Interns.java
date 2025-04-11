package com.hrapp.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "inced_interns")
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
    private int presence = 0;        // Total Present Days
}
