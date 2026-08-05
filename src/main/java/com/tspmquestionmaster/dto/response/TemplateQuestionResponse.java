package com.tspmquestionmaster.dto.response;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class TemplateQuestionResponse {


    private Long id;


    private Long questionId;


    private String questionText;


    private String questionType;


    private Boolean mandatory;


    private Integer orderNo;

}
