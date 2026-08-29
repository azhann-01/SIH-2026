package com.codexminds.indusync.dto;

import lombok.Data;

@Data
public class DocumentRequest {
    private String fileName;
    private String fileUrl;
    private String documentType;
}