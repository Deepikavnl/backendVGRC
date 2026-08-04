package com.tspmquestionmaster.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CloneQuestionRequest {

    @NotEmpty(message = "Question IDs are required")
    private List<Long> questionIds;

}