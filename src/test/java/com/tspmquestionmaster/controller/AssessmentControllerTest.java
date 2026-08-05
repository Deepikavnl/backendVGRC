package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.service.AssessmentService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@WebMvcTest(AssessmentController.class)
@AutoConfigureMockMvc(addFilters = false)
class AssessmentControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private AssessmentService assessmentService;



    @Test
    void getAllAssessments_success() throws Exception {


        AssessmentResponse response =
                new AssessmentResponse();


        when(assessmentService.getAllAssessments())
                .thenReturn(
                        List.of(response)
                );


        mockMvc.perform(
                        get("/api/assessments")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getAllAssessments_empty() throws Exception {


        when(assessmentService.getAllAssessments())
                .thenReturn(
                        List.of()
                );


        mockMvc.perform(
                        get("/api/assessments")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getAssessmentById_success() throws Exception {


        AssessmentResponse response =
                new AssessmentResponse();


        when(assessmentService.getAssessmentById(1L))
                .thenReturn(response);



        mockMvc.perform(
                        get("/api/assessments/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getAssessmentsByEntity_success() throws Exception {


        when(assessmentService.getAssessmentsByEntity(1L))
                .thenReturn(
                        List.of(
                                new AssessmentResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/assessments/entity/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void deleteAssessment_success() throws Exception {


        mockMvc.perform(
                        delete("/api/assessments/1")
                )
                .andExpect(status().isNoContent());

    }





    @Test
    void getAssessmentByToken_success() throws Exception {


        when(assessmentService.getAssessmentByToken("TOKEN123"))
                .thenReturn(
                        new AssessmentResponse()
                );


        mockMvc.perform(
                        get("/api/assessments/token/TOKEN123")
                )
                .andExpect(status().isOk());

    }

}