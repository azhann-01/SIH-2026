package com.codexminds.indusync.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codexminds.indusync.dto.ApplicationRequest;
import com.codexminds.indusync.dto.ApplicationResponse;
import com.codexminds.indusync.entity.Application;
import com.codexminds.indusync.service.ApplicationService;

@RestController
@RequestMapping("/api/application")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // Create new application for a project
    @PostMapping("/{projectId}")
    public ResponseEntity<?> create(
            @PathVariable Long projectId,
            @RequestBody ApplicationRequest request) {

        try {
            Application app =
                    applicationService.createApplication(
                            request,
                            projectId
                    );

            return ResponseEntity.ok(
                    new ApplicationResponse(app)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Government: get all applications
    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {

        List<ApplicationResponse> list =
                applicationService.getAllApplications()
                        .stream()
                        .map(ApplicationResponse::new)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // Get applications of a specific project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(
            @PathVariable Long projectId) {

        List<ApplicationResponse> list =
                applicationService
                        .getApplicationsByProject(projectId)
                        .stream()
                        .map(ApplicationResponse::new)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // Get application by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    new ApplicationResponse(
                            applicationService
                                    .getApplicationById(id)
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Government: update application status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        try {
            return ResponseEntity.ok(
                    new ApplicationResponse(
                            applicationService
                                    .updateStatus(id, status)
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}