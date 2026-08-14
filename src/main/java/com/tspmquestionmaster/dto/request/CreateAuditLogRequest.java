package com.tspmquestionmaster.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAuditLogRequest {

    @NotBlank(message = "User is required")
    private String user;

    private String userRole;

    @NotBlank(message = "Action is required")
    private String action;

    @NotBlank(message = "Module is required")
    private String module;

    private String entity;

    private String previousValue;

    private String newValue;

    private String ip;
}