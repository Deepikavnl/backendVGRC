package com.tspmquestionmaster.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tspmquestionmaster.dto.request.CreateEntityRequest;
import com.tspmquestionmaster.dto.request.EntityFilterRequest;
import com.tspmquestionmaster.dto.request.EntitySearchRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityRequest;
import com.tspmquestionmaster.dto.response.EntityResponse;
import com.tspmquestionmaster.service.ThirdPartyEntityService;
import org.springframework.security.test.context.support.WithMockUser;
import org.junit.jupiter.api.Test;

import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;


@WebMvcTest(ThirdPartyEntityController.class)
@WithMockUser(
        username = "testuser",
        roles = {"ADMIN"}
)
class ThirdPartyEntityControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @Autowired
    private ObjectMapper objectMapper;


    @MockitoBean
    private ThirdPartyEntityService entityService;



    @Test
    void createEntity_success() throws Exception {


        CreateEntityRequest request = new CreateEntityRequest();

        request.setName("ABC Vendor");
        request.setType("Vendor");
        request.setCategory("IT");
        request.setCountry("India");
        request.setWebsite("https://abc.com");
        request.setCriticality("HIGH");
        request.setRiskRating("LOW");
        request.setComplianceScore(80);
        request.setAssessmentCount(5);
        request.setOpenFindings(1);
        request.setStatus("ACTIVE");
        request.setSpend(50000.0);



        EntityResponse response = new EntityResponse();

        response.setId(1L);
        response.setName("ABC Vendor");


        when(entityService.createEntity(any(CreateEntityRequest.class)))
                .thenReturn(response);



        mockMvc.perform(
                        post("/api/entities")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk());


        verify(entityService)
                .createEntity(any(CreateEntityRequest.class));

    }






    @Test
    void getAllEntities_success() throws Exception {


        when(entityService.getAllEntities())
                .thenReturn(
                        List.of(new EntityResponse())
                );


        mockMvc.perform(
                        get("/api/entities")
                )
                .andDo(print())
                .andExpect(status().isOk());



        verify(entityService)
                .getAllEntities();

    }





    @Test
    void getEntityById_success() throws Exception {


        EntityResponse response = new EntityResponse();

        response.setId(1L);


        when(entityService.getEntityById(1L))
                .thenReturn(response);



        mockMvc.perform(
                        get("/api/entities/1")
                )
                .andDo(print())
                .andExpect(status().isOk());



        verify(entityService)
                .getEntityById(1L);

    }





    @Test
    void updateEntity_success() throws Exception {


        UpdateEntityRequest request = new UpdateEntityRequest();


        request.setName("Updated Vendor");
        request.setType("Vendor");
        request.setCategory("Security");
        request.setCountry("India");
        request.setWebsite("https://updated.com");
        request.setCriticality("MEDIUM");
        request.setRiskRating("HIGH");
        request.setComplianceScore(90);
        request.setAssessmentCount(10);
        request.setOpenFindings(2);
        request.setStatus("ACTIVE");
        request.setSpend(75000.0);



        EntityResponse response = new EntityResponse();

        response.setId(1L);
        response.setName("Updated Vendor");



        when(entityService.updateEntity(
                eq(1L),
                any(UpdateEntityRequest.class)
        ))
                .thenReturn(response);



        mockMvc.perform(
                        put("/api/entities/1")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk());



        verify(entityService)
                .updateEntity(
                        eq(1L),
                        any(UpdateEntityRequest.class)
                );

    }

    @Test
    void deleteEntity_success() throws Exception {


        doNothing()
                .when(entityService)
                .deleteEntity(1L);



        mockMvc.perform(
                        delete("/api/entities/1")
                                .with(csrf())
                )
                .andDo(print())
                .andExpect(status().isOk());



        verify(entityService)
                .deleteEntity(1L);

    }





    @Test
    void searchEntities_success() throws Exception {


        EntitySearchRequest request =
                new EntitySearchRequest();



        when(entityService.searchEntities(any()))
                .thenReturn(
                        List.of(new EntityResponse())
                );



        mockMvc.perform(
                        post("/api/entities/search")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andDo(print())
                .andExpect(status().isOk());



        verify(entityService)
                .searchEntities(any());

    }





    @Test
    void getEntities_page_success() throws Exception {


        Page<EntityResponse> page =
                new PageImpl<>(
                        List.of(new EntityResponse())
                );



        when(entityService.getEntities(
                anyInt(),
                anyInt(),
                anyString(),
                anyString()
        ))
                .thenReturn(page);



        mockMvc.perform(
                        get("/api/entities/page")
                )
                .andDo(print())
                .andExpect(status().isOk());



        verify(entityService)
                .getEntities(
                        anyInt(),
                        anyInt(),
                        anyString(),
                        anyString()
                );

    }





    @Test
    void filterEntities_success() throws Exception {


        EntityFilterRequest request =
                new EntityFilterRequest();



        when(entityService.filterEntities(any()))
                .thenReturn(
                        List.of(new EntityResponse())
                );



        mockMvc.perform(
                        post("/api/entities/filter")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andDo(print())
                .andExpect(status().isOk());



        verify(entityService)
                .filterEntities(any());

    }

}