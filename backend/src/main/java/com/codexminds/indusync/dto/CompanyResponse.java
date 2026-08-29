package com.codexminds.indusync.dto;

import com.codexminds.indusync.entity.Company;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CompanyResponse {
    private Long id;
    private String name;
    private String registrationNumber;
    private String industryType;
    private String address;
    private String contactEmail;
    private String contactPhone;
    private Long ownerId;
    private LocalDateTime createdAt;

    public CompanyResponse(Company company) {
        this.id = company.getId();
        this.name = company.getName();
        this.registrationNumber = company.getRegistrationNumber();
        this.industryType = company.getIndustryType();
        this.address = company.getAddress();
        this.contactEmail = company.getContactEmail();
        this.contactPhone = company.getContactPhone();
        this.ownerId = company.getOwner().getId();
        this.createdAt = company.getCreatedAt();
    }
}