package com.tspmquestionmaster.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "entities")
public class ThirdPartyEntity extends BaseEntity {

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "type", nullable = false, length = 100)
    private String type;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "country", nullable = false, length = 100)
    private String country;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "criticality", nullable = false, length = 50)
    private String criticality;

    @Column(name = "risk_rating", nullable = false, length = 50)
    private String riskRating;

    @Column(name = "compliance_score")
    private Integer complianceScore;


    @Column(name = "open_findings")
    private Integer openFindings;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "annual_spend")
    private Double spend;

    @OneToMany(
            mappedBy = "entity",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<EntityContact> contacts = new ArrayList<>();

    @OneToMany(
            mappedBy = "entity",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<EntityDocument> documents = new ArrayList<>();

    @OneToMany(
            mappedBy = "entity",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<EntityAssessment> assessments = new ArrayList<>();

    @OneToMany(
            mappedBy = "entity",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<EntityFinding> findings = new ArrayList<>();
}