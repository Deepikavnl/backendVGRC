package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.AssessmentAnswerResponse;
import com.tspmquestionmaster.service.AssessmentAnswerService;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(AssessmentAnswerController.class)
class AssessmentAnswerControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private AssessmentAnswerService service;



    @Test
    void getAnswersByAssessment_success() throws Exception {


        AssessmentAnswerResponse response =
                new AssessmentAnswerResponse();

        // add fields here if your DTO has them
        // response.setAnswerValue("YES");


        when(service.getAnswersByAssessment(1L))
                .thenReturn(
                        List.of(response)
                );


        mockMvc.perform(
                        get("/api/assessment-answers/assessment/1")
                )
                .andDo(print());

    }





    @Test
    void getAnswersByAssessment_emptyList() throws Exception {


        when(service.getAnswersByAssessment(1L))
                .thenReturn(
                        List.of()
                );


        mockMvc.perform(
                        get("/api/assessment-answers/assessment/1")
                )
                .andDo(print())
                .andExpect(status().isOk());

    }

}