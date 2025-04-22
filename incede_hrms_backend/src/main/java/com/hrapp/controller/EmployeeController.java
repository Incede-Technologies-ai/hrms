package com.hrapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrapp.model.Employee;
import com.hrapp.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/employees")
// @CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;
    
    @GetMapping
    @Operation(summary = "Get all employees")
    public List<Employee> getAllEmployees() {
        return employeeService.getActiveEmployees();
    }

    @GetMapping("/inactive")
    @Operation(summary = "Get all inactive employees")
    public List<Employee> getInactiveEmployees() {
        return employeeService.getInactiveEmployees();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<?> getEmployee(@PathVariable Long id) {
        try {
            Employee employee = employeeService.getEmployeeById(id);
            return ResponseEntity.ok(employee);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    @Operation(summary = "Create a new employee")
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        try {
            employee.setSickLeaves(5.0);
            double availableLeaves = employeeService.calculateMonthsPassed(employee.getJoiningDate());
            employee.setLeaves(availableLeaves);
            Employee savedEmployee = employeeService.saveEmployee(employee);
            return ResponseEntity.ok(Map.of(
                "message", "Employee added successfully",
                "employee", savedEmployee
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an employee")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employee);
            return ResponseEntity.ok(Map.of(
                "message", "Employee updated successfully",
                "employee", updatedEmployee
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{employeeId}/soft-delete")
    @Operation(summary = "Soft delete an employee")
    public ResponseEntity<String> softDeleteEmployee(@PathVariable String employeeId) {
        try {
            employeeService.softDeleteEmployee(employeeId);
            return ResponseEntity.ok("Employee soft deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
