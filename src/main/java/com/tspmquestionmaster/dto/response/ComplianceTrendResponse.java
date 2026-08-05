package com.tspmquestionmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComplianceTrendResponse {

    private String month;

    private Double score;
}