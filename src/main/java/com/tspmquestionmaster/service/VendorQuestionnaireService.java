package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.response.VendorQuestionnaireResponse;
import com.tspmquestionmaster.dto.response.VendorQuestionnairePageResponse;



import java.util.List;
import com.tspmquestionmaster.dto.response.VendorQuestionnairePageResponse;
public interface VendorQuestionnaireService {

    /**
     * Get all questionnaire questions for an assessment.
     */
    List<VendorQuestionnaireResponse> getQuestionnaire(Long assessmentId);

    /**
     * Save or update a vendor's answer.
     */
    void saveAnswer(Long assessmentId,
                    Long questionId,
                    String answer);
    VendorQuestionnairePageResponse getQuestionnaireByToken(String token);
    /**
     * Submit the completed assessment.
     */
    VendorQuestionnairePageResponse getQuestionnairePage(
            Long assessmentId
    );
    void submitAssessment(Long assessmentId);

}