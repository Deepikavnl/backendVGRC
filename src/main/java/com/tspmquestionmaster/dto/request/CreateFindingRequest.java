package com.tspmquestionmaster.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateFindingRequest {


    private Long assessmentId;


    private Long questionId;


    private String title;


    private String description;


    private String severity;


    private String recommendation;


    private String owner;


    private LocalDate dueDate;


    private String topic;


}