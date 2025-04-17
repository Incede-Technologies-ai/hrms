package com.hrapp.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrapp.model.Employee;
import com.hrapp.model.LeaveTransaction;

@Repository
public interface LeaveTransactionRepository extends JpaRepository<LeaveTransaction, Long> {
    List<LeaveTransaction> findByEmployeeAndLeaveDateBetween(Employee employee, LocalDate startDate, LocalDate endDate);

    List<LeaveTransaction> findByEmployeeId(Long employeeId);

    @Query("SELECT lt FROM LeaveTransaction lt WHERE lt.employee.employeeId = :employeeId AND YEAR(lt.appliedDate) = :year")
    List<LeaveTransaction> findByEmployeeAndYear(@Param("employeeId") String employeeId, @Param("year") int year);
}
