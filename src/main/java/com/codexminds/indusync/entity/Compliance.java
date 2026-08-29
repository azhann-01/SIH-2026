package com.codexminds.indusync.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "compliances")
@Data
public class Compliance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private String title;
    private String description;
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, COMPLETED, OVERDUE
    }
}