package com.hrdataentry.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.hrdataentry.model.ExtractedData;
import com.hrdataentry.model.Dimension;
import com.hrdataentry.model.Annotation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PdfService {

    public ExtractedData processPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            
            ExtractedData data = new ExtractedData();
            data.setTitle(extractTitle(text));
            data.setDimensions(extractDimensions(text));
            data.setAnnotations(extractAnnotations(text));
            
            return data;
        }
    }

    private String extractTitle(String text) {
        Pattern pattern = Pattern.compile("TITLE:\\s*(.+)");
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group(1).trim() : "Unknown Title";
    }

    private List<Dimension> extractDimensions(String text) {
        List<Dimension> dimensions = new ArrayList<>();
        Pattern pattern = Pattern.compile("(\\d+(?:\\.\\d+)?)[\\s]*(?:mm|cm|in)");
        Matcher matcher = pattern.matcher(text);
        
        while (matcher.find()) {
            Dimension dimension = new Dimension();
            dimension.setType("Length");
            dimension.setValue(matcher.group(1));
            dimension.setUnit(matcher.group(2));
            dimensions.add(dimension);
        }
        
        return dimensions;
    }

    private List<Annotation> extractAnnotations(String text) {
        List<Annotation> annotations = new ArrayList<>();
        Pattern pattern = Pattern.compile("NOTE:\\s*(.+)");
        Matcher matcher = pattern.matcher(text);
        
        while (matcher.find()) {
            Annotation annotation = new Annotation();
            annotation.setType("Note");
            annotation.setContent(matcher.group(1).trim());
            annotations.add(annotation);
        }
        
        return annotations;
    }
}
