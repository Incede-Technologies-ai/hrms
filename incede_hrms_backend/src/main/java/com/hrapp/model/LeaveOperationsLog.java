package com.hrapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "leave_operations_log")
public class LeaveOperationsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String operationType; // "ANNUAL_CREDIT" or "SICK_RESET"

    @Column(nullable = false)
    private LocalDate operationDate;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public LocalDate getOperationDate() {
        return operationDate;
    }

    public void setOperationDate(LocalDate operationDate) {
        this.operationDate = operationDate;
    }
}