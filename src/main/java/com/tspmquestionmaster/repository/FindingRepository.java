
        package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.Finding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FindingRepository extends JpaRepository<Finding, Long> {

    /*
     * Get all findings with their assessment and entity.
     */
    @Query("""
            SELECT DISTINCT f
            FROM Finding f
            LEFT JOIN FETCH f.assessment a
            LEFT JOIN FETCH a.entity e
            """)
    List<Finding> findAllWithEntity();


    /*
     * Get findings belonging to a specific assessment.
     */
    List<Finding> findByAssessment_Id(Long assessmentId);
}

