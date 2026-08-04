package com.tspmquestionmaster.dto.request;
import java.util.List;
import com.tspmquestionmaster.enums.QuestionStatus;
import com.tspmquestionmaster.enums.QuestionType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateQuestionRequest {

    @NotBlank(message = "Question code is required")
    private String code;

    @NotBlank(message = "Question text is required")
    private String questionText;

    private String helpText;

    @NotNull(message = "Question type is required")
    private QuestionType questionType;

    @NotNull(message = "Topic is required")
    private Long topicId;

    @NotNull(message = "Weight is required")
    @Min(1)
    @Max(10)
    private Integer weight;

    @NotNull(message = "Mandatory field is required")
    private Boolean mandatory;

    @NotNull(message = "Status is required")
    private QuestionStatus status;




}