package com.codexminds.indusync.controller;

import com.codexminds.indusync.dto.DocumentRequest;
import com.codexminds.indusync.dto.DocumentResponse;
import com.codexminds.indusync.entity.Document;
import com.codexminds.indusync.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/document")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/{applicationId}")
    public ResponseEntity<?> upload(@PathVariable Long applicationId, @RequestBody DocumentRequest request) {
        try {
            Document doc = documentService.uploadDocument(request, applicationId);
            return ResponseEntity.ok(new DocumentResponse(doc));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<?> getByApplication(@PathVariable Long applicationId) {
        List<DocumentResponse> list = documentService.getDocumentsByApplication(applicationId)
                .stream().map(DocumentResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}