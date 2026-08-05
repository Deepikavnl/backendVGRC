package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.EntityAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface EntityAssessmentRepository extends JpaRepository<EntityAssessment, Long> {

    boolean existsByCode(String code);

    List<EntityAssessment> findByEntityId(Long entityId);
    Optional<EntityAssessment> findByAssessmentToken(String assessmentToken);
}