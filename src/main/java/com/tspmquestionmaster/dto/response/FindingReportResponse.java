package com.tspmquestionmaster.dto.response;

import lombok.Data;

@Data
public class FindingReportResponse {

    private String code;

    private String title;

    private String severity;

    private String status;

}