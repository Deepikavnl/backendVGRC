package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
public class ReviewerDecisionResponse {


    private Long id;


    private Long assessmentId;


    private Long questionId;


    private String decision;


    private String comment;


    private LocalDateTime reviewedAt;


}