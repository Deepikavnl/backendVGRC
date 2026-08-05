package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.CreateTopicRequest;
import com.tspmquestionmaster.dto.request.TopicFilterRequest;
import com.tspmquestionmaster.dto.request.TopicSearchRequest;
import com.tspmquestionmaster.dto.request.UpdateTopicRequest;
import com.tspmquestionmaster.dto.response.TopicResponse;
import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.enums.TopicStatus;
import com.tspmquestionmaster.exception.DuplicateResourceException;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.TopicMapper;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.repository.TopicRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class TopicServiceImplTest {


    @Mock
    private TopicRepository topicRepository;


    @Mock
    private TopicMapper topicMapper;


    @Mock
    private QuestionRepository questionRepository;


    @InjectMocks
    private TopicServiceImpl service;


    private Topic topic;
    private TopicResponse response;


    @BeforeEach
    void setUp() {

        topic = new Topic();

        topic.setId(1L);
        topic.setName("Network Security");
        topic.setDescription("Security related topics");
        topic.setColor("BLUE");
        topic.setStatus(TopicStatus.ACTIVE);


        response = new TopicResponse();

        response.setId(1L);
        response.setName("Network Security");

    }



    @Test
    void createTopic_success() {


        CreateTopicRequest request =
                new CreateTopicRequest();

        request.setName("Network Security");
        request.setDescription("Security related topics");
        request.setColor("BLUE");


        when(topicRepository.existsByName("Network Security"))
                .thenReturn(false);


        when(topicRepository.save(any(Topic.class)))
                .thenReturn(topic);


        when(topicMapper.toResponse(topic))
                .thenReturn(response);


        when(questionRepository.countByTopicId(1L))
                .thenReturn(5L);



        TopicResponse result =
                service.createTopic(request);


        assertNotNull(result);
        assertEquals(
                "Network Security",
                result.getName()
        );


        verify(topicRepository)
                .save(any(Topic.class));

    }



    @Test
    void createTopic_duplicate() {


        CreateTopicRequest request =
                new CreateTopicRequest();

        request.setName("Network Security");


        when(topicRepository.existsByName(
                "Network Security"))
                .thenReturn(true);



        assertThrows(
                DuplicateResourceException.class,
                () -> service.createTopic(request)
        );


        verify(topicRepository, never())
                .save(any());

    }



    @Test
    void updateTopic_success() {


        UpdateTopicRequest request =
                new UpdateTopicRequest();

        request.setName("Updated Topic");
        request.setDescription("Updated");
        request.setColor("RED");
        request.setStatus(TopicStatus.ACTIVE);



        when(topicRepository.findById(1L))
                .thenReturn(Optional.of(topic));


        when(topicRepository.save(topic))
                .thenReturn(topic);


        when(topicMapper.toResponse(topic))
                .thenReturn(response);


        when(questionRepository.countByTopicId(1L))
                .thenReturn(0L);



        TopicResponse result =
                service.updateTopic(1L, request);


        assertNotNull(result);


        verify(topicRepository)
                .save(topic);

    }




    @Test
    void updateTopic_notFound() {


        UpdateTopicRequest request =
                new UpdateTopicRequest();


        when(topicRepository.findById(1L))
                .thenReturn(Optional.empty());



        assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateTopic(1L, request)
        );

    }




    @Test
    void getTopicById_success() {


        when(topicRepository.findById(1L))
                .thenReturn(Optional.of(topic));


        when(topicMapper.toResponse(topic))
                .thenReturn(response);


        when(questionRepository.countByTopicId(1L))
                .thenReturn(3L);



        TopicResponse result =
                service.getTopicById(1L);



        assertNotNull(result);
        assertEquals(
                1L,
                result.getId()
        );


    }




    @Test
    void getTopicById_notFound() {


        when(topicRepository.findById(1L))
                .thenReturn(Optional.empty());


        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getTopicById(1L)
        );

    }




    @Test
    void getAllTopics_success() {


        when(topicRepository.findAll())
                .thenReturn(List.of(topic));


        when(topicMapper.toResponse(topic))
                .thenReturn(response);


        when(questionRepository.countByTopicId(1L))
                .thenReturn(2L);



        List<TopicResponse> result =
                service.getAllTopics();



        assertEquals(
                1,
                result.size()
        );


    }




    @Test
    void searchTopics_success() {


        TopicSearchRequest request =
                new TopicSearchRequest();


        request.setKeyword("Network");


        when(topicRepository.findAll())
                .thenReturn(List.of(topic));


        when(topicMapper.toResponse(topic))
                .thenReturn(response);


        when(questionRepository.countByTopicId(1L))
                .thenReturn(0L);



        List<TopicResponse> result =
                service.searchTopics(request);



        assertEquals(
                1,
                result.size()
        );

    }




    @Test
    void filterTopics_success() {


        TopicFilterRequest request =
                new TopicFilterRequest();


        request.setStatus(
                TopicStatus.ACTIVE
        );


        when(topicRepository.findAll())
                .thenReturn(List.of(topic));


        when(topicMapper.toResponse(topic))
                .thenReturn(response);


        when(questionRepository.countByTopicId(1L))
                .thenReturn(0L);



        List<TopicResponse> result =
                service.filterTopics(request);



        assertEquals(
                1,
                result.size()
        );

    }




    @Test
    void getTopics_success() {


        Pageable pageable =
                PageRequest.of(
                        0,
                        10,
                        Sort.by("name")
                );


        Page<Topic> page =
                new PageImpl<>(
                        List.of(topic),
                        pageable,
                        1
                );


        when(topicRepository.findAll(any(Pageable.class)))
                .thenReturn(page);


        when(topicMapper.toResponse(topic))
                .thenReturn(response);


        when(questionRepository.countByTopicId(1L))
                .thenReturn(0L);



        Page<TopicResponse> result =
                service.getTopics(
                        0,
                        10,
                        "name",
                        "ASC"
                );



        assertEquals(
                1,
                result.getTotalElements()
        );

    }





    @Test
    void deleteTopic_success() {


        when(topicRepository.findById(1L))
                .thenReturn(Optional.of(topic));


        when(questionRepository.countByTopicId(1L))
                .thenReturn(0L);



        service.deleteTopic(1L);



        verify(topicRepository)
                .delete(topic);

    }





    @Test
    void deleteTopic_questionMapped_failure() {


        when(topicRepository.findById(1L))
                .thenReturn(Optional.of(topic));


        when(questionRepository.countByTopicId(1L))
                .thenReturn(5L);



        assertThrows(
                RuntimeException.class,
                () -> service.deleteTopic(1L)
        );


        verify(topicRepository, never())
                .delete(topic);

    }


}