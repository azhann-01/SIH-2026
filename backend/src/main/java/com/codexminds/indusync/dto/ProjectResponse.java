package com.codexminds.indusync.dto;

import com.codexminds.indusync.entity.Project;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private Double investmentAmount;
    private Integer numberOfEmployees;
    private String landType;
    private String status;
    private Long companyId;
    private LocalDateTime createdAt;

    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.location = project.getLocation();
        this.investmentAmount = project.getInvestmentAmount();
        this.numberOfEmployees = project.getNumberOfEmployees();
        this.landType = project.getLandType();
        this.status = project.getStatus().name();
        this.companyId = project.getCompany().getId();
        this.createdAt = project.getCreatedAt();
    }
}