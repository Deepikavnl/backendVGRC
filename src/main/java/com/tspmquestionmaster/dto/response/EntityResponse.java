package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntityResponse {

    private Long id;

    private String name;

    private String type;

    private String category;

    private String country;

    private String website;

    private String criticality;

    private String riskRating;

    private Integer complianceScore;

    private Integer assessmentCount;

    private Integer openFindings;

    private String status;

    private Double spend;
}