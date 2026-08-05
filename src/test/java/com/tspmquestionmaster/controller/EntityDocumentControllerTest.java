package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.EntityDocumentResponse;
import com.tspmquestionmaster.service.EntityDocumentService;

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



@WebMvcTest(EntityDocumentController.class)
@AutoConfigureMockMvc(addFilters = false)
class EntityDocumentControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private EntityDocumentService entityDocumentService;




    @Test
    void getAllDocuments_success() throws Exception {


        when(entityDocumentService.getAllDocuments())
                .thenReturn(
                        List.of(
                                new EntityDocumentResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/entity-documents")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getDocumentById_success() throws Exception {


        when(entityDocumentService.getDocumentById(1L))
                .thenReturn(
                        new EntityDocumentResponse()
                );


        mockMvc.perform(
                        get("/api/entity-documents/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getDocumentsByEntity_success() throws Exception {


        when(entityDocumentService.getDocumentsByEntity(1L))
                .thenReturn(
                        List.of(
                                new EntityDocumentResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/entity-documents/entity/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void deleteDocument_success() throws Exception {


        doNothing()
                .when(entityDocumentService)
                .deleteDocument(1L);


        mockMvc.perform(
                        delete("/api/entity-documents/1")
                )
                .andExpect(status().isOk());

    }

}