package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.QuestionResponse;
import com.tspmquestionmaster.service.QuestionService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.core.io.InputStreamResource;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.io.ByteArrayInputStream;
import java.util.List;


import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@WebMvcTest(QuestionController.class)
@AutoConfigureMockMvc(addFilters = false)
class QuestionControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private QuestionService questionService;



    @Test
    void getAllQuestions_success() throws Exception {


        when(questionService.getAllQuestions())
                .thenReturn(
                        List.of(
                                new QuestionResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/questions")
                )
                .andExpect(status().isOk());

    }




    @Test
    void getQuestionById_success() throws Exception {


        when(questionService.getQuestionById(1L))
                .thenReturn(
                        new QuestionResponse()
                );


        mockMvc.perform(
                        get("/api/questions/1")
                )
                .andExpect(status().isOk());

    }




    @Test
    void getQuestionsByTopic_success() throws Exception {


        when(questionService.getQuestionsByTopic(1L))
                .thenReturn(
                        List.of(
                                new QuestionResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/questions/topic/1")
                )
                .andExpect(status().isOk());

    }




    @Test
    void getQuestions_page_success() throws Exception {


        Page<QuestionResponse> page =
                new PageImpl<>(
                        List.of(new QuestionResponse()),
                        PageRequest.of(0,10),
                        1
                );


        when(questionService.getQuestions(
                0,
                10,
                "createdAt",
                "DESC"
        ))
                .thenReturn(page);



        mockMvc.perform(
                        get("/api/questions/page")
                )
                .andExpect(status().isOk());

    }





    @Test
    void deleteQuestion_success() throws Exception {


        doNothing()
                .when(questionService)
                .deleteQuestion(1L);


        mockMvc.perform(
                        delete("/api/questions/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void exportQuestions_success() throws Exception {


        when(questionService.exportQuestions())
                .thenReturn(
                        new ByteArrayInputStream(
                                "Question\nTest"
                                        .getBytes()
                        )
                );


        mockMvc.perform(
                        get("/api/questions/export")
                )
                .andExpect(status().isOk());

    }

}