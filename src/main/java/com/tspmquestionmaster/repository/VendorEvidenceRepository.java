package com.tspmquestionmaster.repository;


import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.VendorEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface VendorEvidenceRepository
        extends JpaRepository<VendorEvidence, Long> {


    List<VendorEvidence> findByAssessment(
            EntityAssessment assessment
    );


    List<VendorEvidence> findByAssessmentAndQuestion(
            EntityAssessment assessment,
            Question question
    );

}