package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.dto.response.ReviewerDecisionResponse;
import com.tspmquestionmaster.service.ReviewerService;


import org.junit.jupiter.api.Test;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;


import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;


import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;



@WebMvcTest(ReviewerController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReviewerControllerTest {



    @Autowired
    private MockMvc mockMvc;



    @MockitoBean
    private ReviewerService reviewerService;





    @Test
    void getWorkspace_success() throws Exception {


        when(reviewerService.getWorkspace(1L))
                .thenReturn(
                        new AssessmentResponse()
                );


        mockMvc.perform(
                        get("/api/reviewer/workspace/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void saveDecision_success() throws Exception {


        when(reviewerService.saveDecision(
                org.mockito.ArgumentMatchers.any()
        ))
                .thenReturn(
                        new ReviewerDecisionResponse()
                );


        mockMvc.perform(
                        post("/api/reviewer/decision")
                                .contentType("application/json")
                                .content("""
                                {
                                  "assessmentId":1,
                                  "questionId":1,
                                  "decision":"APPROVED",
                                  "comment":"OK"
                                }
                                """)
                )
                .andExpect(status().isOk());

    }





    @Test
    void approveAssessment_success() throws Exception {


        doNothing()
                .when(reviewerService)
                .approveAssessment(1L);



        mockMvc.perform(
                        put("/api/reviewer/1/approve")
                )
                .andExpect(status().isOk())
                .andExpect(
                        content()
                                .string("Assessment approved")
                );

    }





    @Test
    void requestCorrection_success() throws Exception {


        doNothing()
                .when(reviewerService)
                .requestCorrection(
                        org.mockito.ArgumentMatchers.anyLong(),
                        org.mockito.ArgumentMatchers.any()
                );



        mockMvc.perform(
                        put("/api/reviewer/1/correction")
                                .contentType("application/json")
                                .content("""
                                {
                                  "comment":"Need correction"
                                }
                                """)
                )
                .andExpect(status().isOk())
                .andExpect(
                        content()
                                .string("Correction requested")
                );

    }





    @Test
    void submitReview_success() throws Exception {


        doNothing()
                .when(reviewerService)
                .submitReview(1L);



        mockMvc.perform(
                        put("/api/reviewer/1/submit")
                )
                .andExpect(status().isOk())
                .andExpect(
                        content()
                                .string("Review submitted successfully")
                );

    }


}