package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.EntityContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntityContactRepository extends JpaRepository<EntityContact, Long> {

    List<EntityContact> findByEntityId(Long entityId);

}