package com.codexminds.indusync.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "schemes")
@Data
public class Scheme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String eligibilityCriteria;
    private String industry;
}