package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.VendorQuestionnairePageResponse;
import com.tspmquestionmaster.service.VendorQuestionnaireService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;

import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import org.springframework.security.test.context.support.WithMockUser;



@WebMvcTest(VendorQuestionnaireController.class)
@WithMockUser(
        username = "admin",
        roles = {"ADMIN"}
)
class VendorQuestionnaireControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private VendorQuestionnaireService vendorQuestionnaireService;




    @Test
    void getQuestionnaire_success() throws Exception {


        VendorQuestionnairePageResponse response =
                new VendorQuestionnairePageResponse();



        when(
                vendorQuestionnaireService.getQuestionnairePage(1L)
        )
                .thenReturn(response);



        mockMvc.perform(
                        get("/api/vendor-questionnaires/1")
                )
                .andExpect(
                        status().isOk()
                );



        verify(
                vendorQuestionnaireService
        )
                .getQuestionnairePage(1L);

    }







    @Test
    void saveAnswer_success() throws Exception {


        doNothing()
                .when(vendorQuestionnaireService)
                .saveAnswer(
                        1L,
                        10L,
                        "YES"
                );



        mockMvc.perform(
                        post("/api/vendor-questionnaires/1/answers")
                                .with(csrf())
                                .param(
                                        "questionId",
                                        "10"
                                )
                                .param(
                                        "answer",
                                        "YES"
                                )
                )
                .andExpect(
                        status().isOk()
                );



        verify(
                vendorQuestionnaireService
        )
                .saveAnswer(
                        1L,
                        10L,
                        "YES"
                );

    }







    @Test
    void submitAssessment_success() throws Exception {


        doNothing()
                .when(vendorQuestionnaireService)
                .submitAssessment(1L);



        mockMvc.perform(
                        post("/api/vendor-questionnaires/1/submit")
                                .with(csrf())
                )
                .andExpect(
                        status().isOk()
                );



        verify(
                vendorQuestionnaireService
        )
                .submitAssessment(1L);

    }







    @Test
    void getQuestionnaireByToken_success() throws Exception {


        VendorQuestionnairePageResponse response =
                new VendorQuestionnairePageResponse();



        when(
                vendorQuestionnaireService
                        .getQuestionnaireByToken("abc123")
        )
                .thenReturn(response);



        mockMvc.perform(
                        get("/api/vendor-questionnaires/token/abc123")
                )
                .andExpect(
                        status().isOk()
                );



        verify(
                vendorQuestionnaireService
        )
                .getQuestionnaireByToken("abc123");

    }


}