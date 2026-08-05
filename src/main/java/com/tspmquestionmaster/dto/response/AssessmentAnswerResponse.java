package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AssessmentAnswerResponse {

    private Long questionId;

    private String questionCode;

    private String questionText;

    // NEW
    private String topic;

    private String answerValue;

    private String status;

    private Integer weight;

    private Boolean mandatory;

    private String reviewerDecision;

    private String reviewerComment;

    private List<VendorEvidenceResponse> evidence;

}