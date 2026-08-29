package com.codexminds.indusync.controller;

import com.codexminds.indusync.dto.ApplicationRequest;
import com.codexminds.indusync.dto.ApplicationResponse;
import com.codexminds.indusync.entity.Application;
import com.codexminds.indusync.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/application")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/{projectId}")
    public ResponseEntity<?> create(@PathVariable Long projectId, @RequestBody ApplicationRequest request) {
        try {
            Application app = applicationService.createApplication(request, projectId);
            return ResponseEntity.ok(new ApplicationResponse(app));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(@PathVariable Long projectId) {
        List<ApplicationResponse> list = applicationService.getApplicationsByProject(projectId)
                .stream().map(ApplicationResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(new ApplicationResponse(applicationService.getApplicationById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(new ApplicationResponse(applicationService.updateStatus(id, status)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}