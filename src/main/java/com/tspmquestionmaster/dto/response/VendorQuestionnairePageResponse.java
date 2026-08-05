package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VendorQuestionnairePageResponse {

    private Long assessmentId;

    private String status;

    private String reviewerComment;

    private List<VendorQuestionnaireResponse> questions;
    private String assessmentToken;
}