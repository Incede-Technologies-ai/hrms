

package com.hrapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrapp.model.InternLeaveTransaction;
import com.hrapp.service.InternLeaveManagementService;

import io.swagger.v3.oas.annotations.Operation;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/intern-leave")
// @CrossOrigin(origins = "http://192.168.1.22:3000")
@CrossOrigin(origins = "*")
public class InternLeaveManagementController {

    @Autowired
    private InternLeaveManagementService internLeaveManagementService;




    @GetMapping("/{internId}")
    @Operation (summary = "Get all leaves of an intern")
    public ResponseEntity<List<InternLeaveTransaction>> getInternLeaves(@PathVariable String internId) {
        return ResponseEntity.ok(internLeaveManagementService.getInternLeaves(internId));
    }

    @PostMapping("/apply")
    @Operation (summary = "Apply for leave")
    public ResponseEntity<?> applyInternLeave(@RequestBody Map<String, Object> request) {
        try {
            String internId = request.get("internId").toString();
            String leaveType = request.get("leaveType").toString();
            int noOfLeaves = Integer.parseInt(request.get("noOfLeaves").toString());
            boolean isHalfDay = Boolean.parseBoolean(request.get("isHalfDay").toString());
            String reason = request.get("reason").toString();

            LocalDate startDate = request.get("startDate") != null ? LocalDate.parse(request.get("startDate").toString()) : null;
            LocalDate endDate = request.get("endDate") != null ? LocalDate.parse(request.get("endDate").toString()) : null;
            LocalDate leaveDate = request.get("leaveDate") != null ? LocalDate.parse(request.get("leaveDate").toString()): null;
            InternLeaveTransaction leave = internLeaveManagementService.applyInternLeave(internId, leaveType, startDate, endDate, noOfLeaves, isHalfDay,leaveDate, reason);
            
            return ResponseEntity.ok(Map.of("message", "Intern Leave Applied Successfully", "leave", leave));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
     
    }
}
