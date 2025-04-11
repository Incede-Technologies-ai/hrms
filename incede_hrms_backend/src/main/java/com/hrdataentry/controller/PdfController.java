package com.hrdataentry.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.hrdataentry.service.PdfService;
import com.hrdataentry.model.ExtractedData;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://192.168.1.22:3000")
public class PdfController {

    @Autowired
    private PdfService pdfService;

    @PostMapping("/upload")
    public ResponseEntity<ExtractedData> uploadPdf(@RequestParam("file") MultipartFile file) {
        try {
            ExtractedData extractedData = pdfService.processPdf(file);
            return ResponseEntity.ok(extractedData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
