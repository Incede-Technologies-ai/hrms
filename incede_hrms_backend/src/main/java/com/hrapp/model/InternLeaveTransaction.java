



package com.hrapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "intern_leave_transactions")
public class InternLeaveTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String internId;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate leaveDate;
    private int noOfLeaves;
    private boolean isHalfDay;
    private String reason;
    private String status = "Pending";
}
