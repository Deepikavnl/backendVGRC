package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.entity.AuditLog;
import com.tspmquestionmaster.service.AuditLogService;

import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;


    @PostMapping
    public AuditLog createAuditLog(
            @RequestBody AuditLog auditLog
    ) {

        return auditLogService.createAuditLog(
                auditLog
        );
    }


    @GetMapping
    public Page<AuditLog> getAuditLogs(

            @RequestParam(
                    required = false,
                    defaultValue = ""
            )
            String search,

            @RequestParam(
                    required = false,
                    defaultValue = ""
            )
            String module,

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "15"
            )
            int size

    ) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );

        return auditLogService.searchAuditLogs(
                search,
                module,
                pageable
        );
    }
    @GetMapping("/modules")
    public List<String> getModules() {

        return auditLogService.getModules();
    }
}