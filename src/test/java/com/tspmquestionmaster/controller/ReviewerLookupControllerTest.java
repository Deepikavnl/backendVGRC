package com.tspmquestionmaster.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tspmquestionmaster.entity.Reviewer;
import com.tspmquestionmaster.entity.Team;
import com.tspmquestionmaster.repository.ReviewerRepository;
import com.tspmquestionmaster.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.mockito.ArgumentMatchers.any;
import java.util.List;
import java.util.Optional;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewerLookupController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReviewerLookupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ReviewerRepository reviewerRepository;

    @MockitoBean
    private TeamRepository teamRepository;

    @Test
    void getAllReviewers_success() throws Exception {

        Team team = new Team();
        team.setId(1L);

        Reviewer reviewer = new Reviewer();
        reviewer.setId(1L);
        reviewer.setReviewerName("John Reviewer");
        reviewer.setEmail("john@test.com");
        reviewer.setTeam(team);

        when(reviewerRepository.findAll()).thenReturn(List.of(reviewer));

        mockMvc.perform(get("/api/reviewers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].reviewerName").value("John Reviewer"))
                .andExpect(jsonPath("$[0].email").value("john@test.com"));
    }

    @Test
    void getByTeam_success() throws Exception {

        Team team = new Team();
        team.setId(1L);

        Reviewer reviewer = new Reviewer();
        reviewer.setId(1L);
        reviewer.setReviewerName("John Reviewer");
        reviewer.setEmail("john@test.com");
        reviewer.setTeam(team);

        when(reviewerRepository.findByTeamId(1L))
                .thenReturn(List.of(reviewer));

        mockMvc.perform(get("/api/reviewers/team/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].reviewerName").value("John Reviewer"))
                .andExpect(jsonPath("$[0].email").value("john@test.com"));
    }

    @Test
    void createReviewer_success() throws Exception {

        Team team = new Team();
        team.setId(1L);

        Reviewer reviewer = new Reviewer();
        reviewer.setId(1L);
        reviewer.setReviewerName("John Reviewer");
        reviewer.setEmail("john@test.com");
        reviewer.setTeam(team);

        when(teamRepository.findById(1L))
                .thenReturn(Optional.of(team));

        when(reviewerRepository.save(any(Reviewer.class)))
                .thenReturn(reviewer);

        mockMvc.perform(post("/api/reviewers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {
                      "reviewerName":"John Reviewer",
                      "email":"john@test.com",
                      "team":{
                        "id":1
                      }
                    }
                    """))
                .andDo(print())
                .andReturn();

}
}