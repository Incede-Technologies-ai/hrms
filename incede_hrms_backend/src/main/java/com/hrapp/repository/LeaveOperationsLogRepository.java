package com.hrapp.repository;

import com.hrapp.model.LeaveOperationsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface LeaveOperationsLogRepository extends JpaRepository<LeaveOperationsLog, Long> {

    boolean existsByOperationTypeAndOperationDateBetween(String operationType, LocalDate startDate, LocalDate endDate);
}