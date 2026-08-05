package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.VendorQuestionnaireAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface VendorQuestionnaireAnswerRepository
        extends JpaRepository<VendorQuestionnaireAnswer, Long> {


    List<VendorQuestionnaireAnswer> findByAssessment(
            EntityAssessment assessment
    );


    Optional<VendorQuestionnaireAnswer> findByAssessmentAndQuestion(
            EntityAssessment assessment,
            Question question
    );

}