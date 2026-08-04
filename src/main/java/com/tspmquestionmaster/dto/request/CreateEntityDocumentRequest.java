package com.tspmquestionmaster.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEntityDocumentRequest {

    @NotNull(message = "Entity Id is required")
    private Long entityId;

    @NotBlank(message = "Document name is required")
    private String name;

    @NotBlank(message = "File name is required")
    private String fileName;

    private String fileType;

    @NotNull(message = "File size is required")
    private Long size;
}