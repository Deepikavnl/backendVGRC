package com.tspmquestionmaster.entity;
import com.tspmquestionmaster.enums.ReviewerDecisionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@Table(name = "reviewer_decisions")
public class ReviewerDecision extends BaseEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "assessment_id",
            nullable = false
    )
    private EntityAssessment assessment;



    @Column(
            name = "question_id",
            nullable = false
    )
    private Long questionId;



    @Enumerated(EnumType.STRING)
    @Column(
            name = "decision",
            nullable = false,
            length = 30
    )
    private ReviewerDecisionType decision;



    @Column(
            name = "comment",
            columnDefinition = "TEXT"
    )
    private String comment;



    @Column(
            name = "reviewed_at"
    )
    private LocalDateTime reviewedAt;



    @PrePersist
    private void setReviewedAt() {
        this.reviewedAt = LocalDateTime.now();
    }

}