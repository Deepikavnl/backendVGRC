package com.tspmquestionmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RiskDistributionResponse {

    private String level;

    private Long count;

}