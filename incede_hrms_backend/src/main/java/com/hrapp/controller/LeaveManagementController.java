package com.hrapp.controller;
import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrapp.model.LeaveTransaction;
import com.hrapp.model.LeaveType;
import com.hrapp.service.EmployeeService;
import com.hrapp.service.LeaveManagementService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/leave")
@CrossOrigin(origins = "*")
public class LeaveManagementController {

    @Autowired
    private LeaveManagementService leaveManagementService;

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/balance/{employeeId}")
    @Operation(summary = "Get leave balance for an employee")
    public ResponseEntity<?> getLeaveBalance(@PathVariable String employeeId) {
        try {
            // Fetch leave balances from the service
            Map<String, Object> leaveBalance = leaveManagementService.getLeaveBalance(employeeId);
            return ResponseEntity.ok(leaveBalance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/mark")
    @Operation(summary = "Mark leave for an employee")
    public ResponseEntity<?> markLeave(@RequestBody Map<String, Object> request) {
        try {
            String employeeId = (String) request.get("employeeId");
            String leaveTypeStr = request.get("leaveType").toString().toUpperCase();
            int no_of_leaves = (int) request.get("noOfLeaves");
            LeaveType leaveType;
            try {
                leaveType = LeaveType.valueOf(leaveTypeStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid leave type: " + leaveTypeStr));
            }

            Boolean isHalfDay = Boolean.parseBoolean(request.get("isHalfDay").toString());
            String reason = request.get("reason").toString();

            LocalDate leaveDate = request.get("leaveDate") != null ? LocalDate.parse(request.get("leaveDate").toString()) : null;
            LocalDate startDate = request.get("startDate") != null ? LocalDate.parse(request.get("startDate").toString()) : null;
            LocalDate endDate = request.get("endDate") != null ? LocalDate.parse(request.get("endDate").toString()) : null;

            int lopCount = leaveType == LeaveType.LOP && request.get("noOfLeaves") != null ?
                    Integer.parseInt(request.get("noOfLeaves").toString()) : 0;

            LeaveTransaction transaction = leaveManagementService.markLeave(
                    employeeId, leaveType, leaveDate, startDate, endDate, no_of_leaves, isHalfDay, reason, lopCount
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Leave marked successfully",
                    "transaction", transaction
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/credit-annual-leaves")
    @Operation(summary = "Credit annual leaves to all employees")
    public ResponseEntity<?> creditAnnualLeaves() {
        try {
            String message = leaveManagementService.creditAnnualLeaves();
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-sick-leaves")
    @Operation(summary = "Reset sick leaves for all employees")
    public ResponseEntity<?> resetSickLeaves() {
        try {
            String message = leaveManagementService.resetSickLeaves();
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
