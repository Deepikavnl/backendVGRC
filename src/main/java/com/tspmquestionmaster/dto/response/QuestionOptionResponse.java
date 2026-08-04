package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionOptionResponse {

    private Long id;

    private String optionText;

    private Integer displayOrder;

}