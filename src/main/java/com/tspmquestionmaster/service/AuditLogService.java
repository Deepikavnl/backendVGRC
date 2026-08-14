package com.tspmquestionmaster.service;

import com.tspmquestionmaster.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuditLogService {

    AuditLog createAuditLog(AuditLog auditLog);

    Page<AuditLog> searchAuditLogs(
            String search,
            String module,
            Pageable pageable
    );

    List<String> getModules();
}