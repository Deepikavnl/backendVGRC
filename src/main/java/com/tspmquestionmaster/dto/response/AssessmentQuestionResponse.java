package com.tspmquestionmaster.dto;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AssessmentQuestionResponse {


    private Long questionId;


    private String questionText;


    private String helpText;


    private String questionType;


    private Integer weight;


    private Boolean mandatory;


    private String answer;


}