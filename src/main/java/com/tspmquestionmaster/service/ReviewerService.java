package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.request.ReviewerQuestionDecisionRequest;
import com.tspmquestionmaster.dto.response.ReviewerDecisionResponse;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.dto.request.ReviewerAssessmentDecisionRequest;

public interface ReviewerService {


    AssessmentResponse getWorkspace(Long assessmentId);



    ReviewerDecisionResponse saveDecision(
            ReviewerQuestionDecisionRequest request
    );



    void approveAssessment(Long assessmentId);
    void requestCorrection(
            Long assessmentId,
            ReviewerAssessmentDecisionRequest request);
    void submitReview(Long assessmentId);

}