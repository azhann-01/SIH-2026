package com.codexminds.indusync.dto;

import com.codexminds.indusync.entity.Application;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationResponse {
    private Long id;
    private Long projectId;
    private String approvalName;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime slaDeadline;
    private String remarks;

    public ApplicationResponse(Application app) {
        this.id = app.getId();
        this.projectId = app.getProject().getId();
        this.approvalName = app.getApprovalName();
        this.status = app.getStatus().name();
        this.submittedAt = app.getSubmittedAt();
        this.slaDeadline = app.getSlaDeadline();
        this.remarks = app.getRemarks();
    }
}