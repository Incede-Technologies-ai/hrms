package com.hrapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "asset_assignments")
public class AssetAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String assetId;

    @Column(nullable = false)
    private String userId; // Can be Employee ID or Intern ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType; // EMPLOYEE or INTERN

    @Column(nullable = false)
    private String userName; // Store Employee or Intern Name

    @Column(nullable = false)
    private LocalDate issueDate;

    @Column(nullable = true)
    private LocalDate returnDate;

    @Column(length = 500)
    private String remarks;

    @Column(nullable = false)
    private int status; // 4 = Assigned, 5 = Returned

    @Transient  
    private String assetType;

    @Transient  
    private String assetSpecification;

    @Transient  
    private String assetSerialNo;

	public enum UserType {
	    EMPLOYEE, INTERN

	}
}

