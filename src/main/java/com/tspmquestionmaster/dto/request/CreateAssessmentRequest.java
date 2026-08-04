package com.tspmquestionmaster.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateAssessmentRequest {

    @NotBlank(message = "Assessment code is required")
    private String code;

    @NotNull(message = "Entity Id is required")
    private Long entityId;

    @NotBlank(message = "Template name is required")
    private String templateName;

    @NotBlank(message = "Reviewer name is required")
    private String reviewerName;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Progress is required")
    @Min(0)
    @Max(100)
    private Integer progress;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;
}