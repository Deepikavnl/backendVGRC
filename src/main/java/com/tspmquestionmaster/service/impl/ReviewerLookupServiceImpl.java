package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.entity.Reviewer;
import com.tspmquestionmaster.repository.ReviewerRepository;
import com.tspmquestionmaster.service.ReviewerLookupService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ReviewerLookupServiceImpl
        implements ReviewerLookupService {


    private final ReviewerRepository reviewerRepository;


    @Override
    public List<Reviewer> getReviewersByTeam(Long teamId) {

        return reviewerRepository.findByTeamId(teamId);

    }

}