package com.hrapp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrapp.model.Employee;
import com.hrapp.model.LeaveOperationsLog;
import com.hrapp.model.LeaveTransaction;
import com.hrapp.model.LeaveType;
import com.hrapp.repository.EmployeeRepository;
import com.hrapp.repository.LeaveOperationsLogRepository;
import com.hrapp.repository.LeaveTransactionRepository;

@Service
public class LeaveManagementService {
    
    @Autowired
    private LeaveTransactionRepository leaveTransactionRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveOperationsLogRepository leaveOperationsLogRepository;

    @Transactional
    public void initializeLeaveBalance(Employee employee) {
        LocalDate joiningDate = employee.getJoiningDate();
        LocalDate currentDate = LocalDate.now();

        // Calculate prorated normal leaves based on joining date
        double normalLeaves = calculateProratedNormalLeaves(joiningDate);
        employee.setLeaves(normalLeaves);

        // Set fixed sick leaves (default value)
        employee.setSickLeaves(5.0);

        // Reset LOP count to 0
        employee.setLopCount(0.0);

        // Save the updated employee entity
        employeeRepository.save(employee);
    }

    private double calculateProratedNormalLeaves(LocalDate joiningDate) {
        if (joiningDate == null) return 12;

        LocalDate currentDate = LocalDate.now();
        int monthsPassed = (currentDate.getYear() - joiningDate.getYear()) * 12 +
                            currentDate.getMonthValue() - joiningDate.getMonthValue();
        // Add 1 to include the joining month **only if joined on or before the 15th**
        if (joiningDate.getDayOfMonth() <= 15) {
            monthsPassed += 1;
        }
        // Ensure the minimum value is 0 (no negative leaves)
        return Math.max(monthsPassed, 0);
    }

    @Transactional
    public LeaveTransaction markLeave(String employeeId, LeaveType leaveType, LocalDate leaveDate,
                                      LocalDate startDate, LocalDate endDate, double noOfLeaves, boolean isHalfDay,
                                      String reason, double lopCount) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId);
        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        // Validate leave balance
        if (leaveType == LeaveType.ANNUAL) {
            if (employee.getLeaves() < noOfLeaves) {
                throw new RuntimeException("Insufficient annual leave balance");
            }
        } else if (leaveType == LeaveType.SICK) {
            if (employee.getSickLeaves() < noOfLeaves) {
                throw new RuntimeException("Insufficient sick leave balance");
            }
        }

        // Create and save the leave transaction
        LeaveTransaction leaveTransaction = new LeaveTransaction();
        leaveTransaction.setEmployee(employee);
        leaveTransaction.setLeaveType(leaveType);
        leaveTransaction.setReason(reason);
        leaveTransaction.setAppliedDate(LocalDate.now());
        leaveTransaction.setIsHalfDay(isHalfDay);

        // Set lopCount based on whether it's a half-day or full-day LOP
        if (leaveType == LeaveType.LOP) {
            if (isHalfDay) {
                leaveTransaction.setLopCount(0.5);
            } else {
                leaveTransaction.setLopCount(noOfLeaves);
            }
        } else {
            leaveTransaction.setLopCount(0.0); // No LOP for non-LOP leave types
        }

        // Set numberOfDays based on whether it's a half-day or full-day leave
        if (isHalfDay) {
            leaveTransaction.setNumberOfDays(0.5);
        } else {
            leaveTransaction.setNumberOfDays(noOfLeaves);
        }

        if (leaveDate != null) {
            leaveTransaction.setLeaveDate(leaveDate);
        } else {
            leaveTransaction.setStartDate(startDate);
            leaveTransaction.setEndDate(endDate);
        }

        LeaveTransaction savedTransaction = leaveTransactionRepository.save(leaveTransaction);

        // Update leave balance
        if (savedTransaction != null) {
            updateLeaveBalance(employee, leaveType, noOfLeaves, isHalfDay, lopCount);
        }

        return savedTransaction;
    }

    public Map<String, Object> getLeaveBalance(String employeeId) {
        // Fetch the employee by ID
        Employee employee = employeeRepository.findByEmployeeId(employeeId);
        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        // Ensure all properties are returned, even if they are null
        return Map.of(
            "normalLeaveBalance", employee.getLeaves() != null ? employee.getLeaves() : 0.0,
            "sickLeaveBalance", employee.getSickLeaves() != null ? employee.getSickLeaves() : 0.0,
            "lopCount", employee.getLopCount() != null ? employee.getLopCount() : 0.0
        );
    }

    private void updateLeaveBalance(Employee employee, LeaveType leaveType, double noOfLeaves, boolean isHalfDay, double lopCount) {
        if (leaveType == LeaveType.SICK) {
            System.out.println("Sick leave processing");
            if (isHalfDay) {
                employee.setSickLeaves(Math.max(employee.getSickLeaves() - 0.5, 0));
            } else {
                employee.setSickLeaves(Math.max(employee.getSickLeaves() - noOfLeaves, 0));
            }
            System.out.println(employee.getSickLeaves() + " sick leave balance");
        }

        if (leaveType == LeaveType.ANNUAL) {
            System.out.println("Annual leave processing");
            if (isHalfDay) {
                employee.setLeaves(Math.max(employee.getLeaves() - 0.5, 0));
            } else {
                employee.setLeaves(Math.max(employee.getLeaves() - noOfLeaves, 0));
            }
            System.out.println(employee.getLeaves() + " annual leave balance");
        }

        if (leaveType == LeaveType.LOP) {
            System.out.println("LOP leave processing");
            if (isHalfDay) {
                employee.setLopCount(employee.getLopCount() + 0.5);
            } else {
                employee.setLopCount(employee.getLopCount() + noOfLeaves);
            }
            System.out.println(employee.getLopCount() + " LOP count");
        }

        // Save the updated employee entity
        employeeRepository.save(employee);
    }

    @Transactional
    public String creditAnnualLeaves() {
        LocalDate currentDate = LocalDate.now();
        int currentMonth = currentDate.getMonthValue();
        int currentYear = currentDate.getYear();

        boolean alreadyCredited = leaveOperationsLogRepository.existsByOperationTypeAndOperationDateBetween(
            "ANNUAL_CREDIT",
            LocalDate.of(currentYear, currentMonth, 1),
            LocalDate.of(currentYear, currentMonth, currentDate.lengthOfMonth())
        );

        if (alreadyCredited) {
            return "Annual leaves have already been credited for this month.";
        }

        List<Employee> employees = employeeRepository.findAll();
        for (Employee employee : employees) {
            employee.setLeaves(employee.getLeaves() + 1);
            employeeRepository.save(employee);
        }

        LeaveOperationsLog log = new LeaveOperationsLog();
        log.setOperationType("ANNUAL_CREDIT");
        log.setOperationDate(currentDate);
        leaveOperationsLogRepository.save(log);

        return "Annual leaves credited successfully.";
    }

    @Transactional
    public String resetSickLeaves() {
        LocalDate currentDate = LocalDate.now();
        int currentYear = currentDate.getYear();

        boolean alreadyReset = leaveOperationsLogRepository.existsByOperationTypeAndOperationDateBetween(
            "SICK_RESET",
            LocalDate.of(currentYear, 1, 1),
            LocalDate.of(currentYear, 12, 31)
        );

        if (alreadyReset) {
            return "Sick leaves have already been reset for this year.";
        }

        List<Employee> employees = employeeRepository.findAll();
        for (Employee employee : employees) {
            employee.setSickLeaves(5.0);
            employeeRepository.save(employee);
        }

        LeaveOperationsLog log = new LeaveOperationsLog();
        log.setOperationType("SICK_RESET");
        log.setOperationDate(currentDate);
        leaveOperationsLogRepository.save(log);

        return "Sick leaves reset successfully.";
    }

    @Transactional
    public String resetLopCount() {
        LocalDate currentDate = LocalDate.now();
        int currentYear = currentDate.getYear();

        // Check if LOP reset has already been performed for this year
        boolean alreadyReset = leaveOperationsLogRepository.existsByOperationTypeAndOperationDateBetween(
            "LOP_RESET",
            LocalDate.of(currentYear, 1, 1),
            LocalDate.of(currentYear, 12, 31)
        );

        if (alreadyReset) {
            return "LOP count has already been reset for this year.";
        }

        // Reset LOP count for all employees
        List<Employee> employees = employeeRepository.findAll();
        for (Employee employee : employees) {
            employee.setLopCount(0.0); // Reset LOP count to 0
            employeeRepository.save(employee);
        }

        // Log the operation
        LeaveOperationsLog log = new LeaveOperationsLog();
        log.setOperationType("LOP_RESET");
        log.setOperationDate(currentDate);
        leaveOperationsLogRepository.save(log);

        return "LOP count reset successfully.";
    }
}
