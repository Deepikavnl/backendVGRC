package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class VendorQuestionnaireResponse {


    private Long questionId;


    private String questionText;


    private String helpText;


    private String questionType;


    private Integer weight;


    private Boolean mandatory;


    private String answer;
    private String reviewerDecision;

    private String reviewerComment;

}