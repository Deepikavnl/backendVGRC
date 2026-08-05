package com.tspmquestionmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AssessmentStatusResponse {

    private String status;

    private long count;
}