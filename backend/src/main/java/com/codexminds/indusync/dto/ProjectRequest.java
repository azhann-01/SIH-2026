package com.codexminds.indusync.dto;

import lombok.Data;

@Data
public class ProjectRequest {

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
    private Boolean generatesHazardousWaste = false;
    private Boolean requiresFireSafety = false;
    private Boolean hasStartedProduction = false;
}