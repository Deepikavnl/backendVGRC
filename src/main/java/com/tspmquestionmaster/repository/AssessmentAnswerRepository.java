package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.AssessmentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AssessmentAnswerRepository
        extends JpaRepository<AssessmentAnswer, Long> {


    List<AssessmentAnswer> findByAssessmentId(Long assessmentId);

}