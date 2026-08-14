package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("""
        SELECT a
        FROM AuditLog a
        WHERE
            (
                :search IS NULL
                OR :search = ''
                OR LOWER(a.username) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(a.action) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(a.entity) LIKE LOWER(CONCAT('%', :search, '%'))
            )
        AND
            (
                :module IS NULL
                OR :module = ''
                OR a.module = :module
            )
        ORDER BY a.timestamp DESC
    """)
    Page<AuditLog> searchAuditLogs(
            @Param("search") String search,
            @Param("module") String module,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT a.module
        FROM AuditLog a
        WHERE a.module IS NOT NULL
        AND a.module <> ''
        ORDER BY a.module
    """)
    List<String> findDistinctModules();
}