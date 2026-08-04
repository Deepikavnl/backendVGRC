package com.company.tspmbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewerDashboardResponse {

    private Long assessmentId;

    private String assessmentCode;

    private Long entityId;

    private String entityName;

    private String templateName;

    private String riskLevel;

    private Integer progress;

    private String status;

    private String reviewerName;

    private LocalDateTime submittedAt;

}