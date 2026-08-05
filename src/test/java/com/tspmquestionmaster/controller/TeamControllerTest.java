package com.tspmquestionmaster.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tspmquestionmaster.dto.response.ReviewerResponse;
import com.tspmquestionmaster.entity.Reviewer;
import com.tspmquestionmaster.entity.Team;
import com.tspmquestionmaster.repository.ReviewerRepository;
import com.tspmquestionmaster.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TeamController.class)
class TeamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TeamRepository teamRepository;

    @MockitoBean
    private ReviewerRepository reviewerRepository;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllTeams_success() throws Exception {

        Team team = new Team();
        team.setId(1L);
        team.setName("Security Team");

        when(teamRepository.findAll())
                .thenReturn(List.of(team));

        mockMvc.perform(get("/api/teams"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Security Team"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createTeam_success() throws Exception {

        Team team = new Team();
        team.setId(1L);
        team.setName("Security Team");

        when(teamRepository.save(any(Team.class)))
                .thenReturn(team);

        mockMvc.perform(post("/api/teams")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(team)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Security Team"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getReviewers_success() throws Exception {

        Reviewer reviewer = new Reviewer();
        reviewer.setId(1L);
        reviewer.setReviewerName("John");
        reviewer.setEmail("john@test.com");

        when(reviewerRepository.findByTeamId(1L))
                .thenReturn(List.of(reviewer));

        mockMvc.perform(get("/api/teams/1/reviewers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].reviewerName").value("John"))
                .andExpect(jsonPath("$[0].email").value("john@test.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getReviewers_emptyList() throws Exception {

        when(reviewerRepository.findByTeamId(99L))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/teams/99/reviewers"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
}