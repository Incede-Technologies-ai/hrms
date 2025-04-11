package com.hrapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrapp.service.ReportService;

import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
// @CrossOrigin(origins = "http://192.168.1.22:3000")
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
}