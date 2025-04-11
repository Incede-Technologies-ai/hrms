package com.hrapp.repository;

import com.hrapp.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmployeeId(String employeeId);
    List<Employee> findEmployeesByJoiningDateBetween(LocalDate startDate, LocalDate endDate);
}

