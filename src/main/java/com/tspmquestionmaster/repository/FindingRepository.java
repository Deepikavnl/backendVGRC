package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.Finding;
import com.tspmquestionmaster.enums.FindingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tspmquestionmaster.enums.FindingSeverity;
import java.util.List;



public interface FindingRepository extends JpaRepository<Finding, Long> {


    List<Finding> findByStatus(FindingStatus status);


    List<Finding> findByAssessmentId(Long assessmentId);


    List<Finding> findBySeverity(FindingSeverity severity);


}