package com.hrapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrapp.model.Employee;
import com.hrapp.model.LeaveTransaction;
import com.hrapp.repository.EmployeeRepository;
import com.hrapp.repository.LeaveTransactionRepository;

@Service
public class ReportService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveTransactionRepository leaveTransactionRepository;

    public List<EmployeeLeaveReport> getEmployeeLeaveReport(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId);
        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        List<LeaveTransaction> leaveTransactions = leaveTransactionRepository.findByEmployeeId(employee.getId());

        System.out.println(leaveTransactions);

        return leaveTransactions.stream()
                .map(leave -> new EmployeeLeaveReport(
                        employee.getEmployeeId(),
                        employee.getFullName(),
                        employee.getDepartment(),
                        leave.getLeaveType().toString(),
                        leave.getReason(),
                        leave.getLeaveDate() != null ? leave.getLeaveDate().toString() : null,
                        leave.getStartDate() != null ? leave.getStartDate().toString() : null,
                        leave.getEndDate() != null ? leave.getEndDate().toString(): null,
                        leave.getNumberOfDays(),
                        leave.getIsHalfDay()
                ))
                .collect(Collectors.toList());
    }

    public static class EmployeeLeaveReport {
        private String employeeId;
        private String fullName;
        private String department;
        private String leaveType;
        private String reason;
        private String leaveDate;
        private String startdate;
        private String endDate;
        private double numberOfDays;
        private boolean isHalfDay; // Add numberOfDays field

        public EmployeeLeaveReport(String employeeId, String fullName, String department, String leaveType, String reason, String leaveDate, String startdate, String endDate, double numberOfDays, boolean isHalfDay) {
            this.employeeId = employeeId;
            this.fullName = fullName;
            this.department = department;
            this.leaveType = leaveType;
            this.reason = reason;
            this.leaveDate = leaveDate;
            this.startdate = startdate;
            this.endDate = endDate;
            this.numberOfDays = numberOfDays; 
            this.isHalfDay = isHalfDay; 
        }

        // Getters and Setters
        public String getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public String getLeaveType() {
            return leaveType;
        }

        public void setLeaveType(String leaveType) {
            this.leaveType = leaveType;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public String getleaveDate() {
            return leaveDate;
        }

        public void setleaveDate(String leaveDate) {
            this.leaveDate = leaveDate;
        }

        public String getStartdate() {
            return startdate;
        }

        public String getEndDate() {
            return endDate;
        }

        public double getNumberOfDays() {
            return numberOfDays;
        }

        public void setNumberOfDays(int numberOfDays) {
            this.numberOfDays = numberOfDays;
        }
        
        public boolean isHalfDay() {
            return isHalfDay;
        }
        public void setHalfDay(boolean isHalfDay) {
            this.isHalfDay = isHalfDay;
        }
}
}