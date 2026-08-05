package com.tspmquestionmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewerWorkspaceResponse {

    private Long id;
    private String reviewerName;
    private String email;

}