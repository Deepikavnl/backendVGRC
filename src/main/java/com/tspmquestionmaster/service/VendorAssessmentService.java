package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.AssessmentQuestionResponse;
import com.tspmquestionmaster.dto.SubmitAnswerRequest;
import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;

import java.util.List;

public interface VendorAssessmentService {


    List<VendorAssessmentResponse> getVendorAssessments();

    List<VendorAssessmentResponse> getVendorHistory();
    VendorAssessmentResponse getAssessmentById(Long assessmentId);


    List<AssessmentQuestionResponse> getAssessmentQuestions(Long assessmentId);


    void submitAnswer(
            Long assessmentId,
            SubmitAnswerRequest request
    );


    void submitAssessment(Long assessmentId);

}