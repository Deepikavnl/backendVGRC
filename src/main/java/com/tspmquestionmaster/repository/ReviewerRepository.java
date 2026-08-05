package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.Reviewer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewerRepository extends JpaRepository<Reviewer, Long> {


    List<Reviewer> findByTeamId(Long teamId);

}