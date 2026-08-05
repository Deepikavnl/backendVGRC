package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.request.LoginRequest;
import com.tspmquestionmaster.dto.response.LoginResponse;
import com.tspmquestionmaster.service.AuthService;
import com.tspmquestionmaster.enums.Role;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private AuthService authService;



    @Test
    void login_success() throws Exception {


        LoginResponse response =
                new LoginResponse(  1L,
                        "Admin User",
                        "admin@test.com",
                        Role.ADMIN,
                        "Login successful",
                        null);


        when(authService.login(any(LoginRequest.class)))
                .thenReturn(response);



        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content("""
                                {
                                  "email": "admin@test.com",
                                  "password": "password"
                                }
                                """)
                )
                .andExpect(status().isOk());

    }



    @Test
    void login_invalidRequest() throws Exception {


        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType("application/json")
                                .content("{}")
                )
                .andExpect(status().isOk());

    }

}