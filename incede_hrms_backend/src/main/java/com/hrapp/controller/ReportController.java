package com.hrapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrapp.service.ReportService;

import io.swagger.v3.oas.annotations.Operation;

import java.util.List;
import java.util.Map;

import com.hrapp.model.AssetAssignment;
import com.hrapp.model.Employee;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/employee-leave/{employeeId}")
    @Operation(summary = "Get Employee Leave Report", description = "Fetches the leave report for a specific employee.")
    public ResponseEntity<List<ReportService.EmployeeLeaveReport>> getEmployeeLeaveReport(@PathVariable String employeeId) {
        List<ReportService.EmployeeLeaveReport> report = reportService.getEmployeeLeaveReport(employeeId);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/lookup/asset/{assetId}")
    @Operation(summary = "Lookup assignment by asset ID")
    public ResponseEntity<List<AssetAssignment>> getAssignmentsByAssetId(@PathVariable String assetId) {
        List<AssetAssignment> assignments = reportService.getAssignmentsByAssetId(assetId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/lookup/user/{userId}")
    @Operation(summary = "Lookup assignment by user ID")
    public ResponseEntity<List<AssetAssignment>> getAssignmentsByUserId(@PathVariable String userId) {
        List<AssetAssignment> assignments = reportService.getAssignmentsByUserId(userId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/hired")
    @Operation(summary = "Get employees hired between two dates")
    public ResponseEntity<List<Employee>> getHiredEmployees(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<Employee> employees = reportService.getHiredEmployees(startDate, endDate);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/annual-leave-report")
    @Operation(summary = "Get annual leave report for an employee")
    public ResponseEntity<?> getAnnualLeaveReport(
            @RequestParam String employeeId,
            @RequestParam int year) {
        try {
            Map<String, Object> leaveReport = reportService.getAnnualLeaveReport(employeeId, year);
            return ResponseEntity.ok(leaveReport);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}