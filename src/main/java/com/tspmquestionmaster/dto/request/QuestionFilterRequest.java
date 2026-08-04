package com.tspmquestionmaster.dto.request;

import com.tspmquestionmaster.enums.QuestionStatus;
import com.tspmquestionmaster.enums.QuestionType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionFilterRequest {

    private Long topicId;

    private QuestionType questionType;

    private QuestionStatus status;

    private Integer page = 0;

    private Integer size = 10;

    private String sortBy = "createdAt";

    private String sortDirection = "DESC";

}