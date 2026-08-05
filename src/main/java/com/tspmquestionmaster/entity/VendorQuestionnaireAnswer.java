package com.tspmquestionmaster.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "vendor_questionnaire_responses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorQuestionnaireAnswer extends BaseEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private EntityAssessment assessment;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;


    @Column(name = "answer_value", columnDefinition = "TEXT")
    private String answerValue;


    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;


    @Column(name = "answered_by")
    private String answeredBy;


    @Column(name = "answered_at")
    private LocalDateTime answeredAt;


    @PrePersist
    public void onCreate(){

        answeredAt = LocalDateTime.now();

    }

}