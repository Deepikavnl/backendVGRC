package com.tspmquestionmaster.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tspmquestionmaster.dto.request.*;
import com.tspmquestionmaster.dto.response.TopicResponse;
import com.tspmquestionmaster.enums.TopicStatus;
import com.tspmquestionmaster.service.TopicService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import org.springframework.security.test.context.support.WithMockUser;


@WebMvcTest(TopicController.class)
@WithMockUser(username = "testuser", roles = {"ADMIN"})
class TopicControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private TopicService topicService;


    @Autowired
    private ObjectMapper objectMapper;



    @Test
    void createTopic_success() throws Exception {


        CreateTopicRequest request = new CreateTopicRequest();

        request.setName("Network Security");
        request.setDescription("Security related topics");
        request.setColor("#5B5FEF");
        request.setStatus(TopicStatus.ACTIVE);



        TopicResponse response = new TopicResponse();

        response.setId(1L);
        response.setName("Network Security");



        when(topicService.createTopic(any(CreateTopicRequest.class)))
                .thenReturn(response);



        mockMvc.perform(
                        post("/api/topics")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk());



        verify(topicService)
                .createTopic(any(CreateTopicRequest.class));

    }





    @Test
    void updateTopic_success() throws Exception {


        UpdateTopicRequest request = new UpdateTopicRequest();


        request.setName("Updated Topic");
        request.setDescription("Updated description");
        request.setColor("#FFFFFF");
        request.setStatus(TopicStatus.ACTIVE);



        TopicResponse response = new TopicResponse();

        response.setId(1L);
        response.setName("Updated Topic");



        when(topicService.updateTopic(
                eq(1L),
                any(UpdateTopicRequest.class)
        ))
                .thenReturn(response);



        mockMvc.perform(
                        put("/api/topics/1")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk());



        verify(topicService)
                .updateTopic(
                        eq(1L),
                        any(UpdateTopicRequest.class)
                );

    }





    @Test
    void getTopicById_success() throws Exception {


        TopicResponse response = new TopicResponse();

        response.setId(1L);
        response.setName("Security");



        when(topicService.getTopicById(1L))
                .thenReturn(response);



        mockMvc.perform(
                        get("/api/topics/1")
                )
                .andExpect(status().isOk());



        verify(topicService)
                .getTopicById(1L);

    }





    @Test
    void getAllTopics_success() throws Exception {


        when(topicService.getAllTopics())
                .thenReturn(
                        List.of(new TopicResponse())
                );



        mockMvc.perform(
                        get("/api/topics")
                )
                .andExpect(status().isOk());



        verify(topicService)
                .getAllTopics();

    }





    @Test
    void getTopics_page_success() throws Exception {


        Page<TopicResponse> page =
                new PageImpl<>(
                        List.of(new TopicResponse())
                );



        when(topicService.getTopics(
                anyInt(),
                anyInt(),
                anyString(),
                anyString()
        ))
                .thenReturn(page);



        mockMvc.perform(
                        get("/api/topics/page")
                )
                .andExpect(status().isOk());



        verify(topicService)
                .getTopics(
                        anyInt(),
                        anyInt(),
                        anyString(),
                        anyString()
                );

    }





    @Test
    void searchTopics_success() throws Exception {


        TopicSearchRequest request =
                new TopicSearchRequest();



        when(topicService.searchTopics(any()))
                .thenReturn(
                        List.of(new TopicResponse())
                );



        mockMvc.perform(
                        post("/api/topics/search")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk());



        verify(topicService)
                .searchTopics(any());

    }





    @Test
    void filterTopics_success() throws Exception {


        TopicFilterRequest request =
                new TopicFilterRequest();



        when(topicService.filterTopics(any()))
                .thenReturn(
                        List.of(new TopicResponse())
                );



        mockMvc.perform(
                        post("/api/topics/filter")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk());



        verify(topicService)
                .filterTopics(any());

    }





    @Test
    void deleteTopic_success() throws Exception {


        doNothing()
                .when(topicService)
                .deleteTopic(1L);



        mockMvc.perform(
                        delete("/api/topics/1")
                                .with(csrf())
                )
                .andExpect(status().isOk());



        verify(topicService)
                .deleteTopic(1L);

    }

}