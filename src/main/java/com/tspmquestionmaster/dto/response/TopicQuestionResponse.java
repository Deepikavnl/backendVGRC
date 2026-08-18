package com.tspmquestionmaster.dto.response;

import com.tspmquestionmaster.enums.QuestionStatus;
import com.tspmquestionmaster.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicQuestionResponse {

    private Long id;

    private String code;

    private String questionText;

    private QuestionType questionType;

    private Integer weight;

    private Boolean mandatory;

    private QuestionStatus status;
}