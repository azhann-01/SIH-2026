package com.codexminds.indusync.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ComplianceRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
}