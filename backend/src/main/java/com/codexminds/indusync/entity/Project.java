package com.codexminds.indusync.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String location;

    private Double investmentAmount;

    private Integer numberOfEmployees;

    private String landType;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PLANNING;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PLANNING,
        IN_PROGRESS,
        OPERATIONAL,
        SUSPENDED
    }
}