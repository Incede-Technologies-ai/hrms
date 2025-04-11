package com.hrapp.repository;

import com.hrapp.model.LeaveTransaction;
import com.hrapp.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveTransactionRepository extends JpaRepository<LeaveTransaction, Long> {
    List<LeaveTransaction> findByEmployeeAndLeaveDateBetween(Employee employee, LocalDate startDate, LocalDate endDate);

    List<LeaveTransaction> findByEmployeeId(Long employeeId);
}
