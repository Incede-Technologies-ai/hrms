package com.hrapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String assetId;

    @Column(nullable = false)
    private String assetType;

    @Column(nullable = false)
    private String assetSpecification;

    @Column(nullable = false, unique = true)
    private String assetSerialNo;

    @Column(length = 500)
    private String remarks;
    
    @Column(nullable = false)
    private int status = 1; // Default to "Working". 1- working, 2- not working, 3 - in service, 4- assigned.
}
