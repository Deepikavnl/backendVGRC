package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AssessmentResponse {

    private Long id;

    private String code;

    private Long entityId;

    private String entityName;

    private String templateName;

    private String reviewerName;

    private String status;

    private Integer progress;

    private LocalDate dueDate;

    private LocalDate submittedAt;

    private LocalDate completedAt;

    private Integer score;

    private String riskLevel;
}