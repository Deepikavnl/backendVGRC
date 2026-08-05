package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface TemplateRepository
        extends JpaRepository<Template,Long> {


    @Query("""
        SELECT DISTINCT t 
        FROM Template t
        LEFT JOIN FETCH t.topics tt
        LEFT JOIN FETCH tt.topic
        WHERE t.name = :name
    """)
    Optional<Template> findByNameWithTopics(
            @Param("name") String name
    );

}