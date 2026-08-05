package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.response.AssessmentAnswerResponse;

import java.util.List;

public interface AssessmentAnswerService {

    /**
     * Get all answers for an assessment
     */
    List<AssessmentAnswerResponse> getAnswersByAssessment(
            Long assessmentId
    );

}