package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.response.AssessmentAnswerResponse;
import com.tspmquestionmaster.entity.AssessmentAnswer;
import org.springframework.stereotype.Component;

@Component
public class AssessmentAnswerMapper {

    public AssessmentAnswerResponse toResponse(
            AssessmentAnswer answer) {

        AssessmentAnswerResponse response =
                new AssessmentAnswerResponse();

        response.setQuestionId(
                answer.getQuestion().getId());

        response.setQuestionCode(
                answer.getQuestion().getCode());

        response.setQuestionText(
                answer.getQuestion().getQuestionText());

        response.setAnswerValue(
                answer.getAnswerValue());

        response.setStatus(
                answer.getStatus());

        response.setWeight(
                answer.getQuestion().getWeight());

        response.setMandatory(
                answer.getQuestion().getMandatory());

        return response;
    }
}