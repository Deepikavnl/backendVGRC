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


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@WebMvcTest(EntityAssessmentController.class)
@AutoConfigureMockMvc(addFilters = false)
class EntityAssessmentControllerTest {



    @Autowired
    private MockMvc mockMvc;



    @MockitoBean
    private AssessmentService assessmentService;




    @Test
    void getAllAssessments_success() throws Exception {


        when(assessmentService.getAllAssessments())
                .thenReturn(
                        List.of(
                                new AssessmentResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/entity-assessments")
                )
                .andExpect(status().isOk());

    }




    @Test
    void getAssessmentById_success() throws Exception {


        when(assessmentService.getAssessmentById(1L))
                .thenReturn(
                        new AssessmentResponse()
                );


        mockMvc.perform(
                        get("/api/entity-assessments/1")
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
                        get("/api/entity-assessments/entity/1")
                )
                .andExpect(status().isOk());

    }




    @Test
    void deleteAssessment_success() throws Exception {


        doNothing()
                .when(assessmentService)
                .deleteAssessment(1L);


        mockMvc.perform(
                        delete("/api/entity-assessments/1")
                )
                .andExpect(status().isOk());

    }

}