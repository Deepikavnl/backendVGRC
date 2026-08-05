package com.tspmquestionmaster.service;

import com.tspmquestionmaster.entity.Reviewer;

import java.util.List;

public interface ReviewerLookupService {

    List<Reviewer> getReviewersByTeam(Long teamId);

}