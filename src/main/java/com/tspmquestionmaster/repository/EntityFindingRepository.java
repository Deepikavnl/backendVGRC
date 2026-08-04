package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.EntityFinding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntityFindingRepository
        extends JpaRepository<EntityFinding, Long> {

    List<EntityFinding> findByEntityId(Long entityId);

}