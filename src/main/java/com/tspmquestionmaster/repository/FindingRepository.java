package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.Finding;
import com.tspmquestionmaster.enums.FindingStatus;
import com.tspmquestionmaster.enums.FindingSeverity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface FindingRepository extends JpaRepository<Finding, Long> {


    List<Finding> findByStatus(FindingStatus status);


    List<Finding> findByAssessmentId(Long assessmentId);


    List<Finding> findBySeverity(FindingSeverity severity);



    @Query("""
        SELECT f
        FROM Finding f
        LEFT JOIN FETCH f.assessment a
        LEFT JOIN FETCH a.entity e
    """)
    List<Finding> findAllWithEntity();


}