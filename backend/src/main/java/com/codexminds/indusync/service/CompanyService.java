package com.codexminds.indusync.service;

import com.codexminds.indusync.dto.CompanyRequest;
import com.codexminds.indusync.entity.Company;
import com.codexminds.indusync.entity.User;
import com.codexminds.indusync.repository.CompanyRepository;
import com.codexminds.indusync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    public Company createCompany(CompanyRequest request, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = new Company();
        company.setName(request.getName());
        company.setRegistrationNumber(request.getRegistrationNumber());
        company.setIndustryType(request.getIndustryType());
        company.setAddress(request.getAddress());
        company.setContactEmail(request.getContactEmail());
        company.setContactPhone(request.getContactPhone());
        company.setOwner(owner);

        return companyRepository.save(company);
    }

    public List<Company> getCompaniesByOwner(Long ownerId) {
        return companyRepository.findByOwnerId(ownerId);
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }
}