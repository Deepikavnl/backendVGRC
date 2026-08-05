package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.EntityAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportRepository extends JpaRepository<EntityAssessment, Long> {


    // Risk Distribution

    @Query("""
        SELECT 
            t.riskRating,
            COUNT(t)
        FROM ThirdPartyEntity t
        GROUP BY t.riskRating
    """)
    List<Object[]> getRiskDistribution();



    // Findings Severity

    @Query("""
        SELECT
            f.severity,
            COUNT(f)
        FROM Finding f
        GROUP BY f.severity
    """)
    List<Object[]> getFindingSeverity();



    // Assessment Status

    @Query("""
        SELECT
            a.status,
            COUNT(a)
        FROM EntityAssessment a
        GROUP BY a.status
    """)
    List<Object[]> getAssessmentStatus();


}