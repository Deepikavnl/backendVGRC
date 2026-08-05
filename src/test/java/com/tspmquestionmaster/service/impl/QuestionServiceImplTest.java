package com.tspmquestionmaster.service.impl;
import com.tspmquestionmaster.entity.Question;

import com.tspmquestionmaster.dto.request.CreateQuestionRequest;
import com.tspmquestionmaster.dto.request.UpdateQuestionRequest;
import com.tspmquestionmaster.dto.response.QuestionResponse;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.exception.DuplicateResourceException;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.QuestionMapper;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.repository.TopicRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private QuestionMapper questionMapper;

    @InjectMocks
    private QuestionServiceImpl questionService;

    private Question question;
    private Topic topic;
    private QuestionResponse response;
    private UpdateQuestionRequest updateRequest;

    @BeforeEach
    void setUp() {

        topic = new Topic();
        topic.setId(1L);

        question = new Question();
        question.setId(1L);
        question.setCode("Q001");
        question.setTopic(topic);

        response = new QuestionResponse();
        response.setCode("Q001");

        updateRequest = new UpdateQuestionRequest();
        updateRequest.setCode("Q001");
        updateRequest.setTopicId(1L);
    }

    // Paste ALL your @Test methods here
}