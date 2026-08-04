package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.EntityDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntityDocumentRepository extends JpaRepository<EntityDocument, Long> {

    List<EntityDocument> findByEntityId(Long entityId);

}