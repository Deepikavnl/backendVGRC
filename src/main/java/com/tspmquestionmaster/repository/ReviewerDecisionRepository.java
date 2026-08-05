package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.enums.ReviewerDecisionType;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.ReviewerDecision;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;



@Repository
public interface ReviewerDecisionRepository
        extends JpaRepository<ReviewerDecision, Long> {



    List<ReviewerDecision> findByAssessmentId(
            Long assessmentId
    );



    Optional<ReviewerDecision> findByAssessmentAndQuestionId(
            EntityAssessment assessment,
            Long questionId
    );



    ReviewerDecision findByAssessmentIdAndQuestionId(
            Long assessmentId,
            Long questionId
    );



    void deleteByAssessmentIdAndQuestionId(
            Long assessmentId,
            Long questionId
    );

    boolean existsByAssessmentIdAndDecision(
            Long assessmentId,
            ReviewerDecisionType decision
    );
}