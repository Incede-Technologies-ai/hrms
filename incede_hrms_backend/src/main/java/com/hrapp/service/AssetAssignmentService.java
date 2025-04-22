package com.hrapp.service;

import com.hrapp.model.AssetAssignment;
import com.hrapp.model.AssetAssignment.UserType;
import com.hrapp.repository.AssetAssignmentRepository;
import com.hrapp.repository.EmployeeRepository;
import com.hrapp.repository.InternRepository;
import com.hrapp.repository.AssetRepository;
import com.hrapp.model.Employee;
import com.hrapp.model.Interns;
import com.hrapp.model.Asset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AssetAssignmentService {

    @Autowired
    private AssetAssignmentRepository assetAssignmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private InternRepository internRepository;

    @Autowired
    private AssetRepository assetRepository;

    // Get all assignments
    public List<AssetAssignment> getAllAssignments() {
        return assetAssignmentRepository.findAll();
    }



    // Find active assignment for an asset
    public Optional<AssetAssignment> findActiveAssignment(String assetId) {
        return assetAssignmentRepository.findTopByAssetIdAndStatusOrderByIssueDateDesc(assetId, 4);
    }

    // Get latest active assignments by User ID
    public List<AssetAssignment> getLatestActiveAssignmentsByUserId(String userId) {
        return assetAssignmentRepository.findLatestActiveAssignments(userId);
    }

    // Assign asset to user (Employee or Intern)
    public AssetAssignment assignAsset(String assetId, String userId, UserType userType, String remarks, String issueDateStr) {
        String userName = fetchUserName(userId, userType);
        if (userName == null) {
            throw new RuntimeException("User not found for ID: " + userId);
        }

        LocalDate issueDate;
        if (issueDateStr != null && !issueDateStr.isEmpty()) {
            try {
                issueDate = LocalDate.parse(issueDateStr);
            } catch (DateTimeParseException e) {
                throw new RuntimeException("Invalid date format. Use YYYY-MM-DD.");
            }
        } else {
            issueDate = LocalDate.now(); // Default to today
        }

        // Create a new asset assignment
        AssetAssignment assignment = new AssetAssignment();
        assignment.setAssetId(assetId);
        assignment.setUserId(userId);
        assignment.setUserType(userType);
        assignment.setUserName(userName);
        assignment.setIssueDate(issueDate);
        assignment.setRemarks(remarks);
        assignment.setStatus(4); // Assigned

        // Update the corresponding asset's status in the Asset table
        Asset asset = assetRepository.findByAssetId(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        asset.setStatus(4); // Set status to "Assigned"
        assetRepository.save(asset);

        return assetAssignmentRepository.save(assignment);
    }

    // Return asset
    public boolean returnAsset(String assetId, String userId, String returnDateStr, String remarks) {
        Optional<AssetAssignment> existingAssignment = assetAssignmentRepository.findTopByAssetIdAndStatusOrderByIssueDateDesc(assetId, 4);
        if (existingAssignment.isPresent()) {
            AssetAssignment previousAssignment = existingAssignment.get();

            LocalDate returnDate;
            if (returnDateStr != null && !returnDateStr.isEmpty()) {
                try {
                    returnDate = LocalDate.parse(returnDateStr);
                } catch (DateTimeParseException e) {
                    throw new RuntimeException("Invalid date format. Use YYYY-MM-DD.");
                }
            } else {
                returnDate = LocalDate.now(); // Default to today
            }

            // Create a new record for the return
            AssetAssignment returnRecord = new AssetAssignment();
            returnRecord.setAssetId(previousAssignment.getAssetId());
            returnRecord.setUserId(previousAssignment.getUserId());
            returnRecord.setUserType(previousAssignment.getUserType());
            returnRecord.setUserName(previousAssignment.getUserName());
            returnRecord.setIssueDate(previousAssignment.getIssueDate());
            returnRecord.setReturnDate(returnDate);
            returnRecord.setRemarks(remarks);
            returnRecord.setStatus(1); // Returned

            // Update the corresponding asset's status in the Asset table
            Asset asset = assetRepository.findByAssetId(assetId)
                    .orElseThrow(() -> new RuntimeException("Asset not found"));
            asset.setStatus(1); // Set status to "Available"
            assetRepository.save(asset);

            assetAssignmentRepository.save(returnRecord);
            return true;
        } else {
            throw new RuntimeException("No active assignment found for asset ID: " + assetId);
        }
    }

    // Fetch Employee or Intern Name
    private String fetchUserName(String userId, UserType userType) {
        if (userType == UserType.EMPLOYEE) {
            Employee employee = employeeRepository.findByEmployeeId(userId);
            return employee != null ? employee.getFullName() : null;
        } else if (userType == UserType.INTERN) {
            return internRepository.findByInternId(userId)
                    .map(Interns::getFullName)
                    .orElse(null);
        }
        return null;
    }

    
}
