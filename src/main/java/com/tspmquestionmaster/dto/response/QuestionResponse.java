package com.tspmquestionmaster.dto.response;

import com.tspmquestionmaster.enums.QuestionStatus;
import com.tspmquestionmaster.enums.QuestionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
public class QuestionResponse {

    private Long id;

    private String code;

    private String questionText;

    private String helpText;

    private QuestionType questionType;

    private Integer weight;

    private Boolean mandatory;

    private QuestionStatus status;

    private TopicResponse topic;

    // Dropdown / Checkbox options

    // Compliance frameworks

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}