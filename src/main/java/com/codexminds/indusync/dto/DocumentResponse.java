package com.codexminds.indusync.dto;

import com.codexminds.indusync.entity.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentResponse {
    private Long id;
    private Long applicationId;
    private String fileName;
    private String fileUrl;
    private String documentType;
    private LocalDateTime uploadedAt;

    public DocumentResponse(Document doc) {
        this.id = doc.getId();
        this.applicationId = doc.getApplication().getId();
        this.fileName = doc.getFileName();
        this.fileUrl = doc.getFileUrl();
        this.documentType = doc.getDocumentType();
        this.uploadedAt = doc.getUploadedAt();
    }
}