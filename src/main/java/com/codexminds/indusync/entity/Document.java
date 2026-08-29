package com.codexminds.indusync.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    private String fileName;
    private String fileUrl;
    private String documentType;
    private LocalDateTime uploadedAt = LocalDateTime.now();
}