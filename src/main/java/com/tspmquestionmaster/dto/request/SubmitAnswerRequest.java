package com.tspmquestionmaster.dto;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SubmitAnswerRequest {


    private Long questionId;


    private String answerValue;


    private String comment;

}