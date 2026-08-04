package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EntityFindingResponse {

    private Long id;

    private Long entityId;

    private String title;

    private String description;

    private String severity;

    private String status;

    private String assignedTo;

    private LocalDate dueDate;
    private String code;
}