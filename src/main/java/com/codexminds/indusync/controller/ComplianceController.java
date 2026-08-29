package com.codexminds.indusync.controller;

import com.codexminds.indusync.dto.ComplianceRequest;
import com.codexminds.indusync.dto.ComplianceResponse;
import com.codexminds.indusync.entity.Compliance;
import com.codexminds.indusync.service.ComplianceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {

    @Autowired
    private ComplianceService complianceService;

    @PostMapping("/{projectId}")
    public ResponseEntity<?> create(@PathVariable Long projectId, @RequestBody ComplianceRequest request) {
        try {
            Compliance c = complianceService.createCompliance(request, projectId);
            return ResponseEntity.ok(new ComplianceResponse(c));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(@PathVariable Long projectId) {
        List<ComplianceResponse> list = complianceService.getComplianceByProject(projectId)
                .stream().map(ComplianceResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}