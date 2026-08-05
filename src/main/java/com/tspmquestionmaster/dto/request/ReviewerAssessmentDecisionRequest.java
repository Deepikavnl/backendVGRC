package com.tspmquestionmaster.dto.request;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ReviewerAssessmentDecisionRequest {


    private Long assessmentId;


    private String decision;


    private String comment;


}