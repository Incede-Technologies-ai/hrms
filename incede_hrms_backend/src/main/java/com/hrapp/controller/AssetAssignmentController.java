package com.hrapp.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrapp.model.AssetAssignment;
import com.hrapp.model.AssetAssignment.UserType;
import com.hrapp.service.AssetAssignmentService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/asset-assignments")
@CrossOrigin(origins = "*")
public class AssetAssignmentController {

    @Autowired
    private AssetAssignmentService assetAssignmentService;

    @GetMapping
    @Operation(summary = "Get all asset assignments")
    public List<AssetAssignment> getAllAssignments() {
        return assetAssignmentService.getAllAssignments();
    }

    @GetMapping("/active/{assetId}")
    @Operation(summary = "Find latest active assignment for an asset")
    public ResponseEntity<?> findActiveAssignment(@PathVariable String assetId) {
        Optional<AssetAssignment> assignment = assetAssignmentService.findActiveAssignment(assetId);
        return assignment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().body(null)); // Fix here
    }

    @GetMapping("/active/user/{userId}")
    @Operation(summary = "Get latest active assignments by user ID")
    public ResponseEntity<List<AssetAssignment>> getLatestActiveAssignmentsByUserId(@PathVariable String userId) {
        try {
            List<AssetAssignment> activeAssignments = assetAssignmentService.getLatestActiveAssignmentsByUserId(userId);
            return ResponseEntity.ok(activeAssignments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/lookup/asset/{assetId}")
    @Operation(summary = "Lookup assignment by asset ID")
    public ResponseEntity<List<AssetAssignment>> getAssignmentsByAssetId(@PathVariable String assetId) {
        List<AssetAssignment> assignments = assetAssignmentService.getAssignmentsByAssetId(assetId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/lookup/user/{userId}")
    @Operation(summary = "Lookup assignment by user ID")
    public ResponseEntity<List<AssetAssignment>> getAssignmentsByUserId(@PathVariable String userId) {
        List<AssetAssignment> assignments = assetAssignmentService.getAssignmentsByUserId(userId);
        return ResponseEntity.ok(assignments);
    }

    @PostMapping("/assign")
    @Operation(summary = "Assign asset to user (Employee or Intern)")
    public ResponseEntity<String> assignAsset(@RequestBody Map<String, Object> requestBody) {
        try {
            String assetId = (String) requestBody.get("assetId");
            String userId = (String) requestBody.get("userId");
            UserType userType = UserType.valueOf((String) requestBody.get("userType")); // Enum conversion
            String remarks = (String) requestBody.get("remarks");
            String issueDate = (String) requestBody.get("issueDate");

            assetAssignmentService.assignAsset(assetId, userId, userType, remarks, issueDate);
            return ResponseEntity.ok("Asset assigned successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/return")
    @Operation(summary = "Return asset")
    public ResponseEntity<String> returnAsset(@RequestBody Map<String, Object> requestBody) {
        try {
            String assetId = (String) requestBody.get("assetId");
            String userId = (String) requestBody.get("userId");
            String returnDateStr = (String) requestBody.get("returnDate");
            String remarks = (String) requestBody.get("remarks");

            boolean returned = assetAssignmentService.returnAsset(assetId, userId, returnDateStr, remarks);
            return returned ? ResponseEntity.ok("Asset returned successfully.") : ResponseEntity.badRequest().body("Assignment not found.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
