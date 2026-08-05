package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class VendorAssessmentResponse {

    private Long id;

    private String code;

    private String templateName;

    private String reviewerName;

    private String status;

    private Integer progress;

    private LocalDate dueDate;

    private Integer score;

    private String assessmentToken;

}