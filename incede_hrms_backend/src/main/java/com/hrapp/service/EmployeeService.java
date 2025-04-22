package com.hrapp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrapp.model.Employee;
import com.hrapp.repository.EmployeeRepository;

@Service
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private LeaveManagementService leaveManagementService;
    
    public List<Employee> getActiveEmployees() {
        return employeeRepository.findAll().stream()
                .filter(Employee::isActive) // Filter active employees
                .collect(Collectors.toList());
    }

    // Soft delete an employee
    public void softDeleteEmployee(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        employee.setActive(false);
        employeeRepository.save(employee);
    }

    @Transactional
    public Employee saveEmployee(Employee employee) {
        try {
            // Save the employee
            Employee savedEmployee = employeeRepository.save(employee);
            
            // Initialize leave balance for new employee
            leaveManagementService.initializeLeaveBalance(savedEmployee);
            
            return savedEmployee;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Employee ID or Email already exists.");
        }
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Transactional
    public Employee updateEmployee(Long id, Employee employee) {
        try {
            Employee existingEmployee = getEmployeeById(id);
            
            existingEmployee.setEmployeeId(employee.getEmployeeId());
            double availableLeaves = calculateMonthsPassed(employee.getJoiningDate());
            existingEmployee.setLeaves(availableLeaves);
            existingEmployee.setFullName(employee.getFullName());
            existingEmployee.setDesignation(employee.getDesignation());
            existingEmployee.setDepartment(employee.getDepartment());
            existingEmployee.setJoiningDate(employee.getJoiningDate());
            existingEmployee.setDateOfBirth(employee.getDateOfBirth());
            existingEmployee.setOfficialEmail(employee.getOfficialEmail());
            existingEmployee.setPersonalEmail(employee.getPersonalEmail());
            existingEmployee.setContactNo(employee.getContactNo());
            existingEmployee.setEmergencyContact(employee.getEmergencyContact());
            
            Employee savedEmployee = employeeRepository.save(existingEmployee);
            leaveManagementService.initializeLeaveBalance(savedEmployee);
            return savedEmployee;
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Employee ID or Email already exists.");
        }
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public int calculateMonthsPassed(LocalDate joiningDate) {
        if (joiningDate == null) return 12;

        LocalDate currentDate = LocalDate.now();
        // Calculate total months passed
        int monthsPassed = (currentDate.getYear() - joiningDate.getYear()) * 12 +
                            currentDate.getMonthValue() - joiningDate.getMonthValue();
        // Add 1 to include the joining month **only if joined on or before the 15th**
        if (joiningDate.getDayOfMonth() <= 15) {
            monthsPassed += 1;
        }
        // Ensure the minimum value is 0 (no negative leaves)
        return Math.max(monthsPassed, 0);
    }

    public List<Employee> getInactiveEmployees() {
        return employeeRepository.findAll().stream()
                .filter(employee -> !employee.isActive()) // Filter inactive employees
                .collect(Collectors.toList());
    }
}
