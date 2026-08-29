package com.codexminds.indusync.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

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

    // ==============================
    // RULES ENGINE FIELDS
    // ==============================

    private String industry;

    private String projectStage;

    private String locationType;

    private Boolean generatesHazardousWaste = false;

    private Boolean requiresFireSafety = false;

    private Boolean hasStartedProduction = false;

    // ==============================
    // PROJECT STATUS
    // ==============================

    @Enumerated(EnumType.STRING)
    private Status status = Status.PLANNING;

    // ==============================
    // COMPANY
    // ==============================

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    // ==============================
    // CREATED AT
    // ==============================

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PLANNING,
        IN_PROGRESS,
        OPERATIONAL,
        SUSPENDED
    }
}