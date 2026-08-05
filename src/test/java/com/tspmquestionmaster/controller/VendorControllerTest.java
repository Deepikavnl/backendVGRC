package com.tspmquestionmaster.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tspmquestionmaster.dto.response.VendorAssessmentResponse;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.service.VendorService;

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



@WebMvcTest(VendorController.class)
@WithMockUser(username = "testuser", roles = {"ADMIN"})
class VendorControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private VendorService vendorService;


    @Autowired
    private ObjectMapper objectMapper;




    @Test
    void getAllVendors_success() throws Exception {


        when(vendorService.getAllVendors())
                .thenReturn(
                        List.of(new ThirdPartyEntity())
                );


        mockMvc.perform(
                        get("/api/vendors")
                )
                .andExpect(status().isOk());


        verify(vendorService)
                .getAllVendors();

    }





    @Test
    void getVendorById_success() throws Exception {


        ThirdPartyEntity entity =
                new ThirdPartyEntity();


        when(vendorService.getVendorById(1L))
                .thenReturn(entity);



        mockMvc.perform(
                        get("/api/vendors/1")
                )
                .andExpect(status().isOk());



        verify(vendorService)
                .getVendorById(1L);

    }





    @Test
    void createVendor_success() throws Exception {


        ThirdPartyEntity vendor =
                new ThirdPartyEntity();



        when(vendorService.createVendor(any(ThirdPartyEntity.class)))
                .thenReturn(vendor);



        mockMvc.perform(
                        post("/api/vendors")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(vendor)
                                )
                )
                .andExpect(status().isOk());



        verify(vendorService)
                .createVendor(any(ThirdPartyEntity.class));

    }





    @Test
    void updateVendor_success() throws Exception {


        ThirdPartyEntity vendor =
                new ThirdPartyEntity();



        when(vendorService.updateVendor(
                eq(1L),
                any(ThirdPartyEntity.class)
        ))
                .thenReturn(vendor);



        mockMvc.perform(
                        put("/api/vendors/1")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(vendor)
                                )
                )
                .andExpect(status().isOk());



        verify(vendorService)
                .updateVendor(
                        eq(1L),
                        any(ThirdPartyEntity.class)
                );

    }





    @Test
    void deleteVendor_success() throws Exception {


        doNothing()
                .when(vendorService)
                .deleteVendor(1L);



        mockMvc.perform(
                        delete("/api/vendors/1")
                                .with(csrf())
                )
                .andExpect(status().isNoContent());



        verify(vendorService)
                .deleteVendor(1L);

    }





    @Test
    void getVendorAssessments_success() throws Exception {


        when(vendorService.getVendorAssessments(1L))
                .thenReturn(
                        List.of(new VendorAssessmentResponse())
                );



        mockMvc.perform(
                        get("/api/vendors/1/assessments")
                )
                .andExpect(status().isOk());



        verify(vendorService)
                .getVendorAssessments(1L);

    }





    @Test
    void getSubmissionHistory_success() throws Exception {


        when(vendorService.getSubmissionHistory(1L))
                .thenReturn(
                        List.of(new VendorAssessmentResponse())
                );



        mockMvc.perform(
                        get("/api/vendors/1/history")
                )
                .andExpect(status().isOk());



        verify(vendorService)
                .getSubmissionHistory(1L);

    }


}