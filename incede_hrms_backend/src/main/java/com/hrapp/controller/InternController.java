package com.hrapp.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrapp.model.Interns;
import com.hrapp.service.InternService;

import io.swagger.v3.oas.annotations.Operation;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/interns")
@CrossOrigin(origins = "*")
public class InternController {

    @Autowired
    private InternService internService;

    @GetMapping
    @Operation(summary = "Get all interns")
    public List<Interns> getAllInterns() {
        return internService.getAllInterns();
    }

    @GetMapping("/{internId}")
    @Operation(summary = "Get intern by ID")
    public ResponseEntity<Interns> getInternById(@PathVariable String internId) {
        return internService.getInternById(internId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Add a new intern")
    public ResponseEntity<Interns> addIntern(@RequestBody Interns intern) {
        return ResponseEntity.ok(internService.addIntern(intern));
    }


    @PutMapping("/{id}")
    @Operation(summary = "Update intern by ID")
    public ResponseEntity<Interns> updateIntern(@PathVariable Long id, @RequestBody Interns updatedIntern) {
        Interns intern = internService.updateIntern(id, updatedIntern);
        return ResponseEntity.ok(intern);
    }
    

    @DeleteMapping("/{internId}")
    @Operation(summary = "Delete intern by ID")
    public ResponseEntity<String> deleteIntern(@PathVariable Long id) {
        internService.deleteIntern(id);
        return ResponseEntity.ok("Intern deleted successfully");
    }

    @PostMapping("/{internId}/attendance")
    @Operation(summary = "Mark attendance for an intern")
    public ResponseEntity<String> markAttendance(@PathVariable String internId, @RequestParam boolean isPresent) {
        internService.markAttendance(internId, isPresent);
        return ResponseEntity.ok("Attendance updated successfully");
    }
}
