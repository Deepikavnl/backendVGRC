package com.tspmquestionmaster.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntityFilterRequest {

    private String type;

    private String riskRating;

    private String status;

    private String country;

    private String category;

}