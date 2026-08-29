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
}