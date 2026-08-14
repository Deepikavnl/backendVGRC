package com.tspmquestionmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {

    private Long id;

    private LocalDateTime timestamp;

    private String user;

    private String userRole;

    private String action;

    private String module;

    private String entity;

    private String previousValue;

    private String newValue;

    private String ip;
}