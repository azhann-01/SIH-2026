package com.codexminds.indusync.dto;

import lombok.Data;

@Data
public class CompanyRequest {
    private String name;
    private String registrationNumber;
    private String industryType;
    private String address;
    private String contactEmail;
    private String contactPhone;
}