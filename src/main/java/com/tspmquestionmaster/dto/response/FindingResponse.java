package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter
@Setter
public class FindingResponse {


    private Long id;


    private String code;


    private String title;


    private String description;


    private Long entityId;


    private String entityName;


    private Long assessmentId;


    private Long questionId;


    private String severity;


    private String status;


    private String owner;


    private LocalDate dueDate;


    private String recommendation;


    private String topic;


    private LocalDateTime createdAt;


}