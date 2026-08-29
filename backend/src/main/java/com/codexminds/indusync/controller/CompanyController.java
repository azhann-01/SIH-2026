package com.codexminds.indusync.controller;

import com.codexminds.indusync.dto.CompanyRequest;
import com.codexminds.indusync.dto.CompanyResponse;
import com.codexminds.indusync.entity.Company;
import com.codexminds.indusync.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping("/{ownerId}")
    public ResponseEntity<?> createCompany(@PathVariable Long ownerId, @RequestBody CompanyRequest request) {
        try {
            Company company = companyService.createCompany(request, ownerId);
            return ResponseEntity.ok(new CompanyResponse(company));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getCompaniesByOwner(@PathVariable Long ownerId) {
        List<CompanyResponse> companies = companyService.getCompaniesByOwner(ownerId)
                .stream()
                .map(CompanyResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable Long id) {
        try {
            Company company = companyService.getCompanyById(id);
            return ResponseEntity.ok(new CompanyResponse(company));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}