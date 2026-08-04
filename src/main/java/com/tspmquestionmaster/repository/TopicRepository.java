package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.enums.TopicStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    Optional<Topic> findByName(String name);

    List<Topic> findByStatus(TopicStatus status);

    boolean existsByName(String name);

}