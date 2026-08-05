package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.EntityContactResponse;
import com.tspmquestionmaster.service.EntityContactService;

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



@WebMvcTest(EntityContactController.class)
@AutoConfigureMockMvc(addFilters = false)
class EntityContactControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private EntityContactService entityContactService;




    @Test
    void getAllContacts_success() throws Exception {


        when(entityContactService.getAllContacts())
                .thenReturn(
                        List.of(
                                new EntityContactResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/entity-contacts")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getContactById_success() throws Exception {


        when(entityContactService.getContactById(1L))
                .thenReturn(
                        new EntityContactResponse()
                );


        mockMvc.perform(
                        get("/api/entity-contacts/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getContactsByEntity_success() throws Exception {


        when(entityContactService.getContactsByEntity(1L))
                .thenReturn(
                        List.of(
                                new EntityContactResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/entity-contacts/entity/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void deleteContact_success() throws Exception {


        doNothing()
                .when(entityContactService)
                .deleteContact(1L);


        mockMvc.perform(
                        delete("/api/entity-contacts/1")
                )
                .andExpect(status().isOk());

    }

}