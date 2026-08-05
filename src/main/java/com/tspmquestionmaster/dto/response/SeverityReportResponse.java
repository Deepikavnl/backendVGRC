package com.tspmquestionmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeverityReportResponse {

    private String severity;

    private long count;
}