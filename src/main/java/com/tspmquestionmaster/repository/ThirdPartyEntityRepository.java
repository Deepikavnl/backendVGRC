package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.ThirdPartyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThirdPartyEntityRepository
        extends JpaRepository<ThirdPartyEntity, Long> {

    boolean existsByNameIgnoreCase(String name);

    List<ThirdPartyEntity> findByNameContainingIgnoreCase(String keyword);

}