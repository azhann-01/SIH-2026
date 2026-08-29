package com.codexminds.indusync.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String approvalName;

    @Enumerated(EnumType.STRING)
    private Status status = Status.SUBMITTED;

    private LocalDateTime submittedAt = LocalDateTime.now();

    private LocalDateTime slaDeadline;

    private String remarks;

    public enum Status {
        SUBMITTED, IN_REVIEW, APPROVED, REJECTED
    }
}