package com.codexminds.indusync.controller;

import com.codexminds.indusync.dto.ProjectRequest;
import com.codexminds.indusync.dto.ProjectResponse;
import com.codexminds.indusync.entity.Project;
import com.codexminds.indusync.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createProject(@PathVariable Long companyId, @RequestBody ProjectRequest request) {
        try {
            Project project = projectService.createProject(request, companyId);
            return ResponseEntity.ok(new ProjectResponse(project));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getProjectsByCompany(@PathVariable Long companyId) {
        List<ProjectResponse> projects = projectService.getProjectsByCompany(companyId)
                .stream().map(ProjectResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        try {
            Project project = projectService.getProjectById(id);
            return ResponseEntity.ok(new ProjectResponse(project));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}