package com.tspmquestionmaster.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tspmquestionmaster.dto.request.CreateFindingRequest;
import com.tspmquestionmaster.dto.response.FindingResponse;
import com.tspmquestionmaster.service.FindingService;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.util.List;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;



@WebMvcTest(FindingController.class)
@AutoConfigureMockMvc(addFilters = false)
class FindingControllerTest {


    @Autowired
    private MockMvc mockMvc;



    @MockitoBean
    private FindingService findingService;



    @Autowired
    private ObjectMapper objectMapper;






    @Test
    void createFinding_success() throws Exception {


        FindingResponse response =
                new FindingResponse();


        response.setId(1L);
        response.setTitle("SQL Injection");
        response.setSeverity("HIGH");
        response.setStatus("OPEN");



        when(
                findingService.createFinding(
                        any(CreateFindingRequest.class)
                )
        )
                .thenReturn(response);



        CreateFindingRequest request =
                new CreateFindingRequest();


        request.setAssessmentId(1L);
        request.setTitle("SQL Injection");
        request.setDescription("DB issue");
        request.setSeverity("HIGH");



        mockMvc.perform(
                        post("/api/findings")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(
                        jsonPath("$.title")
                                .value("SQL Injection")
                )
                .andExpect(
                        jsonPath("$.severity")
                                .value("HIGH")
                )
                .andExpect(
                        jsonPath("$.status")
                                .value("OPEN")
                );

    }








    @Test
    void getAllFindings_success() throws Exception {


        FindingResponse response =
                new FindingResponse();


        response.setId(1L);
        response.setTitle("Weak Password");



        when(
                findingService.getAllFindings()
        )
                .thenReturn(
                        List.of(response)
                );



        mockMvc.perform(
                        get("/api/findings")
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.length()")
                                .value(1)
                )
                .andExpect(
                        jsonPath("$[0].title")
                                .value("Weak Password")
                );


    }









    @Test
    void getFindingById_success() throws Exception {



        FindingResponse response =
                new FindingResponse();



        response.setId(5L);
        response.setTitle("Encryption Missing");



        when(
                findingService.getFindingById(5L)
        )
                .thenReturn(response);




        mockMvc.perform(
                        get("/api/findings/5")
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.id")
                                .value(5)
                )
                .andExpect(
                        jsonPath("$.title")
                                .value("Encryption Missing")
                );


    }









    @Test
    void updateStatus_success() throws Exception {


        FindingResponse response =
                new FindingResponse();


        response.setId(1L);
        response.setStatus("RESOLVED");



        when(
                findingService.updateStatus(
                        1L,
                        "RESOLVED"
                )
        )
                .thenReturn(response);




        mockMvc.perform(
                        put("/api/findings/1/status")
                                .param(
                                        "status",
                                        "RESOLVED"
                                )
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.status")
                                .value("RESOLVED")
                );


    }



}