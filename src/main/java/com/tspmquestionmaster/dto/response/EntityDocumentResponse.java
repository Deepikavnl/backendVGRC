package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EntityDocumentResponse {

    private Long id;

    private Long entityId;

    private String entityName;

    private String name;

    private String fileName;

    private String fileType;

    private Long size;

    private LocalDate uploadedAt;
}