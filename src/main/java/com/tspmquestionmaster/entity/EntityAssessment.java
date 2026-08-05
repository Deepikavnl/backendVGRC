package com.tspmquestionmaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "entity_assessments")
public class EntityAssessment extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "template_name", nullable = false, length = 200)
    private String templateName;

    @Column(name = "reviewer_name", length = 150)
    private String reviewerName;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "progress")
    private Integer progress;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "submitted_at")
    private LocalDate submittedAt;

    @Column(name = "completed_at")
    private LocalDate completedAt;

    @Column(name = "score")
    private Integer score;

    @Column(name = "assessment_token", unique = true, length = 100)
    private String assessmentToken;

    @Column(name = "reviewer_comment", length = 3000)
    private String reviewerComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private ThirdPartyEntity entity;
}