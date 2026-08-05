package com.tspmquestionmaster.dto.response;

import lombok.Data;

@Data
public class VendorReportResponse {

    private Long id;

    private String name;

    private String riskRating;

    private Integer complianceScore;

}