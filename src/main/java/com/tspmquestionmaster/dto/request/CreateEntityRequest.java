package com.tspmquestionmaster.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEntityRequest {

    @NotBlank(message = "Entity Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Country is required")
    private String country;

    private String website;

    private String description;

    @NotBlank(message = "Criticality is required")
    private String criticality;

    @NotBlank(message = "Risk Rating is required")
    private String riskRating;

    @NotBlank(message = "Status is required")
    private String status;

    private Double spend;

}