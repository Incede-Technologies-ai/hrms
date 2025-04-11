package com.hrapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "leave_transactions") // Ensure table name is specified
public class LeaveTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private Boolean isHalfDay = false;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private LocalDate appliedDate;

    @Column
    private LocalDate leaveDate;

    @Column(nullable = true)
    private LocalDate startDate;

    @Column(nullable = true)
    private LocalDate endDate;

    @Column(nullable = false)
    private Integer lopCount = 0;

    @Column(name = "number_of_days", nullable = false)
    private int numberOfDays;

    @Transient
    private Boolean isLop; // Derived field, not stored in the database
}
