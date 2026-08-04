package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.request.CreateAssessmentRequest;
import com.tspmquestionmaster.dto.request.UpdateAssessmentRequest;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import java.util.List;

public interface AssessmentService {

    /**
     * Create Assessment
     */
    AssessmentResponse createAssessment(CreateAssessmentRequest request);

    /**
     * Update Assessment
     */
    AssessmentResponse updateAssessment(
            Long id,
            UpdateAssessmentRequest request
    );

    /**
     * Get Assessment By Id
     */
    AssessmentResponse getAssessmentById(Long id);

    /**
     * Get All Assessments
     */
    List<AssessmentResponse> getAllAssessments();

    /**
     * Get Assessments By Entity
     */
    List<AssessmentResponse> getAssessmentsByEntity(Long entityId);

    /**
     * Delete Assessment
     */
    void deleteAssessment(Long id);

}