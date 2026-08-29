package com.codexminds.indusync.dto;

import com.codexminds.indusync.entity.Compliance;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ComplianceResponse {
    private Long id;
    private Long projectId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String status;

    public ComplianceResponse(Compliance c) {
        this.id = c.getId();
        this.projectId = c.getProject().getId();
        this.title = c.getTitle();
        this.description = c.getDescription();
        this.dueDate = c.getDueDate();
        this.status = c.getStatus().name();
    }
}