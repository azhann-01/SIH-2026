package com.codexminds.indusync.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codexminds.indusync.dto.ProjectResponse;
import com.codexminds.indusync.entity.Company;
import com.codexminds.indusync.repository.CompanyRepository;
import com.codexminds.indusync.repository.ProjectRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/{ownerId}")
    public ResponseEntity<?> getDashboard(
            @PathVariable Long ownerId) {

        Map<String, Object> data = new HashMap<>();

        // Get companies belonging to this user
        List<Company> companies =
                companyRepository.findByOwnerId(ownerId);

        data.put("companies", companies);

        // Get projects belonging to those companies
        List<ProjectResponse> projects =
                companies.stream()
                        .flatMap(company ->
                                projectRepository
                                        .findByCompanyId(company.getId())
                                        .stream()
                                        .map(ProjectResponse::new)
                        )
                        .collect(Collectors.toList());

        data.put("projects", projects);

        return ResponseEntity.ok(data);
    }
}