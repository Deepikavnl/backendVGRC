package com.tspmquestionmaster.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tspmquestionmaster.dto.AssessmentQuestionResponse;
import com.tspmquestionmaster.dto.SubmitAnswerRequest;
import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.service.VendorAssessmentService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import org.springframework.security.test.context.support.WithMockUser;



@WebMvcTest(VendorAssessmentController.class)
@WithMockUser(username = "testuser", roles = {"ADMIN"})
class VendorAssessmentControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private VendorAssessmentService vendorAssessmentService;


    @Autowired
    private ObjectMapper objectMapper;



    @Test
    void getVendorAssessments_success() throws Exception {


        when(vendorAssessmentService.getVendorAssessments())
                .thenReturn(
                        List.of(new VendorAssessmentResponse())
                );


        mockMvc.perform(
                        get("/api/vendor-assessments/vendor")
                )
                .andExpect(status().isOk());


        verify(vendorAssessmentService)
                .getVendorAssessments();

    }





    @Test
    void getAssessmentById_success() throws Exception {


        VendorAssessmentResponse response =
                new VendorAssessmentResponse();


        when(vendorAssessmentService.getAssessmentById(1L))
                .thenReturn(response);



        mockMvc.perform(
                        get("/api/vendor-assessments/1")
                )
                .andExpect(status().isOk());



        verify(vendorAssessmentService)
                .getAssessmentById(1L);

    }





    @Test
    void getQuestions_success() throws Exception {


        when(vendorAssessmentService.getAssessmentQuestions(1L))
                .thenReturn(
                        List.of(new AssessmentQuestionResponse())
                );



        mockMvc.perform(
                        get("/api/vendor-assessments/1/questionnaire")
                )
                .andExpect(status().isOk());



        verify(vendorAssessmentService)
                .getAssessmentQuestions(1L);

    }





    @Test
    void submitAssessment_success() throws Exception {


        SubmitAnswerRequest request =
                new SubmitAnswerRequest();



        doNothing()
                .when(vendorAssessmentService)
                .submitAssessment(1L);



        mockMvc.perform(
                        post("/api/vendor-assessments/1/submit")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk());



        verify(vendorAssessmentService)
                .submitAssessment(1L);

    }





    @Test
    void getVendorHistory_success() throws Exception {


        when(vendorAssessmentService.getVendorHistory())
                .thenReturn(
                        List.of(new VendorAssessmentResponse())
                );



        mockMvc.perform(
                        get("/api/vendor-assessments/vendor/history")
                )
                .andExpect(status().isOk());



        verify(vendorAssessmentService)
                .getVendorHistory();

    }





    @Test
    void testEndpoint_success() throws Exception {


        mockMvc.perform(
                        get("/api/vendor-assessments/test")
                )
                .andExpect(status().isOk())
                .andExpect(
                        content().string(
                                "Vendor Controller Working"
                        )
                );

    }


}