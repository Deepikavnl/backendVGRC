package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.entity.AuditLog;
import com.tspmquestionmaster.repository.AuditLogRepository;
import com.tspmquestionmaster.service.AuditLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public AuditLog createAuditLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    @Override
    public Page<AuditLog> searchAuditLogs(
            String search,
            String module,
            Pageable pageable
    ) {
        return auditLogRepository.searchAuditLogs(
                search,
                module,
                pageable
        );
    }

    @Override
    public List<String> getModules() {
        return auditLogRepository.findDistinctModules();
    }
}