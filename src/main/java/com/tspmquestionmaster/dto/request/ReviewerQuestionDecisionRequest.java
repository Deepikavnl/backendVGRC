package com.tspmquestionmaster.dto.request;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ReviewerQuestionDecisionRequest {


    private Long assessmentId;


    private Long questionId;


    private String decision;


    private String comment;


}