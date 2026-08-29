package com.codexminds.indusync.controller;

import com.codexminds.indusync.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private ComplianceRepository complianceRepository;

    @GetMapping("/{ownerId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long ownerId) {
        Map<String, Object> data = new HashMap<>();
        data.put("companies", companyRepository.findByOwnerId(ownerId));
        return ResponseEntity.ok(data);
    }
}