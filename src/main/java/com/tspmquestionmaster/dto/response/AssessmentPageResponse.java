package com.tspmquestionmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentPageResponse {

    private List<AssessmentResponse> content;

    private int page;

    private int size;

    private long totalElements;

    private int totalPages;

}