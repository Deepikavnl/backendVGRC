package com.tspmquestionmaster.controller;
import com.tspmquestionmaster.dto.response.ReviewerResponse;
import com.tspmquestionmaster.entity.Reviewer;
import com.tspmquestionmaster.entity.Team;
import com.tspmquestionmaster.repository.ReviewerRepository;
import com.tspmquestionmaster.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeamController {

    private final TeamRepository teamRepository;
    private final ReviewerRepository reviewerRepository;

    @GetMapping
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamRepository.save(team);
    }
    @GetMapping("/{teamId}/reviewers")
    public List<ReviewerResponse> getReviewers(@PathVariable Long teamId) {

        return reviewerRepository.findByTeamId(teamId)
                .stream()
                .map(reviewer -> {
                    ReviewerResponse response = new ReviewerResponse();
                    response.setId(reviewer.getId());
                    response.setReviewerName(reviewer.getReviewerName());
                    response.setEmail(reviewer.getEmail());
                    return response;
                })
                .toList();
    }
}