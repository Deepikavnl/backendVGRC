package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.response.ReviewerWorkspaceResponse;
import com.tspmquestionmaster.dto.response.ReviewerWorkspaceResponse;
import com.tspmquestionmaster.entity.Reviewer;
import com.tspmquestionmaster.repository.ReviewerRepository;
import com.tspmquestionmaster.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviewers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewerLookupController {

    private final ReviewerRepository reviewerRepository;
    private final TeamRepository teamRepository;

    @GetMapping
    public List<ReviewerWorkspaceResponse> getAllReviewers() {

        return reviewerRepository.findAll()
                .stream()
                .map(reviewer -> new ReviewerWorkspaceResponse(
                        reviewer.getId(),
                        reviewer.getReviewerName(),
                        reviewer.getEmail()
                ))
                .toList();
    }

    @GetMapping("/team/{teamId}")
    public List<ReviewerWorkspaceResponse> getByTeam(@PathVariable Long teamId) {

        return reviewerRepository.findByTeamId(teamId)
                .stream()
                .map(reviewer -> new ReviewerWorkspaceResponse(
                        reviewer.getId(),
                        reviewer.getReviewerName(),
                        reviewer.getEmail()
                ))
                .toList();
    }

    @PostMapping
    public Reviewer createReviewer(@RequestBody Reviewer reviewer) {

        reviewer.setTeam(
                teamRepository.findById(reviewer.getTeam().getId())
                        .orElseThrow(() -> new RuntimeException("Team not found"))
        );

        return reviewerRepository.save(reviewer);
    }
}