package com.tspmquestionmaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "entity_findings")
public class EntityFinding extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "title", nullable = false, length = 300)
    private String title;

    @Column(name = "description", length = 3000)
    private String description;

    @Column(name = "severity", nullable = false, length = 50)
    private String severity;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private ThirdPartyEntity entity;
    @Column(name = "assigned_to")
    private String assignedTo;
}