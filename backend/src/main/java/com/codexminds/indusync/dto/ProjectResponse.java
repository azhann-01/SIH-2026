package com.codexminds.indusync.dto;

import java.time.LocalDateTime;

import com.codexminds.indusync.entity.Project;

import lombok.Data;

@Data
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private String location;
    private Double investmentAmount;
    private Integer numberOfEmployees;
    private String landType;

    // Rules Engine fields
    private String industry;
    private String projectStage;
    private String locationType;
    private Boolean generatesHazardousWaste;
    private Boolean requiresFireSafety;
    private Boolean hasStartedProduction;

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

        // Rules Engine fields
        this.industry = project.getIndustry();
        this.projectStage = project.getProjectStage();
        this.locationType = project.getLocationType();
        this.generatesHazardousWaste =
                project.getGeneratesHazardousWaste();
        this.requiresFireSafety =
                project.getRequiresFireSafety();
        this.hasStartedProduction =
                project.getHasStartedProduction();

        this.status = project.getStatus().name();
        this.companyId = project.getCompany().getId();
        this.createdAt = project.getCreatedAt();
    }
}