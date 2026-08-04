package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.request.CreateAssessmentRequest;
import com.tspmquestionmaster.dto.request.UpdateAssessmentRequest;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import org.springframework.stereotype.Component;

@Component
public class AssessmentMapper {

    public EntityAssessment toEntity(CreateAssessmentRequest request,
                                     ThirdPartyEntity entity) {

        EntityAssessment assessment = new EntityAssessment();

        assessment.setCode(request.getCode());
        assessment.setTemplateName(request.getTemplateName());
        assessment.setReviewerName(request.getReviewerName());
        assessment.setStatus(request.getStatus());
        assessment.setProgress(request.getProgress());
        assessment.setDueDate(request.getDueDate());
        assessment.setEntity(entity);

        return assessment;
    }

    public void updateEntity(UpdateAssessmentRequest request,
                             EntityAssessment assessment,
                             ThirdPartyEntity entity) {

        assessment.setCode(request.getCode());
        assessment.setTemplateName(request.getTemplateName());
        assessment.setReviewerName(request.getReviewerName());
        assessment.setStatus(request.getStatus());
        assessment.setProgress(request.getProgress());
        assessment.setDueDate(request.getDueDate());
        assessment.setEntity(entity);
    }

    public AssessmentResponse toResponse(EntityAssessment assessment) {

        AssessmentResponse response = new AssessmentResponse();

        response.setId(assessment.getId());
        response.setCode(assessment.getCode());

        response.setEntityId(assessment.getEntity().getId());
        response.setEntityName(assessment.getEntity().getName());

        response.setTemplateName(assessment.getTemplateName());
        response.setReviewerName(assessment.getReviewerName());

        response.setStatus(assessment.getStatus());
        response.setProgress(assessment.getProgress());

        response.setDueDate(assessment.getDueDate());
        response.setSubmittedAt(assessment.getSubmittedAt());
        response.setCompletedAt(assessment.getCompletedAt());

        response.setScore(assessment.getScore());

        // Get risk level from ThirdPartyEntity
        response.setRiskLevel(assessment.getEntity().getRiskRating());

        return response;
    }
}