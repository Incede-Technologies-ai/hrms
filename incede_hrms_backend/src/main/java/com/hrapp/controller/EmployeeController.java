package com.hrapp.controller;

import com.hrapp.model.Employee;
import com.hrapp.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/hired")
    @Operation(summary = "Get employees hired between two dates")
    public ResponseEntity<List<Employee>> getHiredEmployees(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<Employee> employees = employeeService.getHiredEmployees(startDate, endDate);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    @Operation(summary = "Create a new employee")
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        try {
            System.out.println("Received employee data: " + employee);
           
            employee.setSickLeaves(5.0);
            double availableLeaves = employeeService.calculateMonthsPassed(employee.getJoiningDate());
            employee.setLeaves(availableLeaves);
            System.out.println(availableLeaves);
            Employee savedEmployee = employeeService.saveEmployee(employee);
            return ResponseEntity.ok(Map.of(
                "message", "Employee added successfully",
                "employee", savedEmployee
            ));
        } catch (Exception e) {
            System.err.println("Error saving employee: " + e.getMessage());
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
        } catch (Exception e) {
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
