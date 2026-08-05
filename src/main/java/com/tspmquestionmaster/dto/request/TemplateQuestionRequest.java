package com.tspmquestionmaster.dto.request;
import lombok.Data;


@Data
public class TemplateQuestionRequest {


    private Long questionId;


    private Boolean mandatory;


    private Integer orderNo;

}