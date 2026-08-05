package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.EntityFindingResponse;
import com.tspmquestionmaster.service.EntityFindingService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.util.List;


import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@WebMvcTest(EntityFindingController.class)
@AutoConfigureMockMvc(addFilters = false)
class EntityFindingControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private EntityFindingService service;



    @Test
    void getAllFindings_success() throws Exception {


        when(service.getAllFindings())
                .thenReturn(
                        List.of(
                                new EntityFindingResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/entity-findings")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getFindingById_success() throws Exception {


        when(service.getFindingById(1L))
                .thenReturn(
                        new EntityFindingResponse()
                );


        mockMvc.perform(
                        get("/api/entity-findings/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getFindingsByEntity_success() throws Exception {


        when(service.getFindingsByEntity(1L))
                .thenReturn(
                        List.of(
                                new EntityFindingResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/entity-findings/entity/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void deleteFinding_success() throws Exception {


        doNothing()
                .when(service)
                .deleteFinding(1L);


        mockMvc.perform(
                        delete("/api/entity-findings/1")
                )
                .andExpect(status().isOk());

    }

}