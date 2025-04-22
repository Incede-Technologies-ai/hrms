package com.hrapp.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrapp.model.Interns;
import com.hrapp.service.InternService;

import io.swagger.v3.oas.annotations.Operation;

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
    

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete intern by ID")
    public ResponseEntity<String> deleteIntern(@PathVariable Long id) {
        internService.deleteIntern(id);
        return ResponseEntity.ok("Intern deleted successfully");
    }

    @GetMapping("/active")
    @Operation(summary = "Get interns by presence")
    public ResponseEntity<List<Interns>> getInterns(@RequestParam(required = false) Integer presence) {
        List<Interns> interns = internService.getInternsByPresence(presence);
        return ResponseEntity.ok(interns);
    }
}
