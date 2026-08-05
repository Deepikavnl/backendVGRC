package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.TemplateRequest;
import com.tspmquestionmaster.dto.request.TemplateTopicRequest;
import com.tspmquestionmaster.dto.response.TemplateResponse;
import com.tspmquestionmaster.entity.Template;
import com.tspmquestionmaster.entity.TemplateTopicMapping;
import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.enums.TemplateStatus;
import com.tspmquestionmaster.enums.TopicStatus;
import com.tspmquestionmaster.mapper.TemplateMapper;
import com.tspmquestionmaster.repository.TemplateRepository;
import com.tspmquestionmaster.repository.TemplateTopicMappingRepository;
import com.tspmquestionmaster.repository.TopicRepository;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TemplateServiceImplTest {

    @Mock
    private TemplateRepository templateRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private TemplateTopicMappingRepository templateTopicMappingRepository;

    @Mock
    private TemplateMapper templateMapper;

    @InjectMocks
    private TemplateServiceImpl templateService;

    private Template template;
    private Topic topic;
    private TemplateRequest request;
    private TemplateResponse response;

    @BeforeEach
    void setUp() {

        topic = new Topic();
        topic.setId(1L);
        topic.setName("Security");
        topic.setDescription("Security Topic");
        topic.setColor("#2196F3");
        topic.setStatus(TopicStatus.ACTIVE);

        template = Template.builder()
                .id(1L)
                .name("Vendor Assessment")
                .description("Assessment Template")
                .category("Security")
                .status(TemplateStatus.DRAFT)
                .version(1)
                .usageCount(0)
                .topics(new ArrayList<>())
                .build();

        TemplateTopicRequest topicRequest =
                new TemplateTopicRequest();

        topicRequest.setTopicId(1L);

        request = new TemplateRequest();
        request.setName("Vendor Assessment");
        request.setDescription("Assessment Template");
        request.setCategory("Security");
        request.setTopics(List.of(topicRequest));

        response = new TemplateResponse();

        response.setId(1L);
        response.setName("Vendor Assessment");
        response.setDescription("Assessment Template");
        response.setCategory("Security");
    }
    @Test
    void createTemplate_success() {

        when(templateRepository.save(any(Template.class)))
                .thenReturn(template);

        when(topicRepository.findById(1L))
                .thenReturn(Optional.of(topic));

        when(templateTopicMappingRepository.save(any(TemplateTopicMapping.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(templateMapper.toResponse(any(Template.class)))
                .thenReturn(response);

        TemplateResponse result =
                templateService.createTemplate(request);

        assertNotNull(result);
        assertEquals("Vendor Assessment", result.getName());

        verify(templateRepository).save(any(Template.class));
        verify(topicRepository).findById(1L);
        verify(templateTopicMappingRepository).save(any());
    }

    @Test
    void createTemplate_topicNotFound() {

        when(templateRepository.save(any(Template.class)))
                .thenReturn(template);

        when(topicRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                EntityNotFoundException.class,
                () -> templateService.createTemplate(request)
        );

        verify(templateRepository).save(any());
    }
    @Test
    void updateTemplate_success() {

        when(templateRepository.findById(1L))
                .thenReturn(Optional.of(template));

        when(topicRepository.findById(1L))
                .thenReturn(Optional.of(topic));

        when(templateRepository.save(any(Template.class)))
                .thenReturn(template);

        when(templateMapper.toResponse(template))
                .thenReturn(response);

        TemplateResponse result =
                templateService.updateTemplate(
                        1L,
                        request
                );

        assertNotNull(result);
        assertEquals("Vendor Assessment", result.getName());

        verify(templateRepository)
                .findById(1L);

        verify(topicRepository)
                .findById(1L);

        verify(templateRepository)
                .save(any(Template.class));
    }


    @Test
    void updateTemplate_templateNotFound() {

        when(templateRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                EntityNotFoundException.class,
                () -> templateService.updateTemplate(
                        1L,
                        request
                )
        );

        verify(templateRepository)
                .findById(1L);

        verify(templateRepository, never())
                .save(any());
    }


    @Test
    void updateTemplate_topicNotFound() {

        when(templateRepository.findById(1L))
                .thenReturn(Optional.of(template));

        when(topicRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                EntityNotFoundException.class,
                () -> templateService.updateTemplate(
                        1L,
                        request
                )
        );

        verify(templateRepository)
                .findById(1L);

        verify(topicRepository)
                .findById(1L);

        verify(templateRepository, never())
                .save(any());
    }


    @Test
    void updateTemplate_withoutTopics() {

        TemplateRequest request =
                new TemplateRequest();

        request.setName("Updated Template");
        request.setDescription("Updated Description");
        request.setCategory("Security");
        request.setTopics(null);

        when(templateRepository.findById(1L))
                .thenReturn(Optional.of(template));

        when(templateRepository.save(any(Template.class)))
                .thenReturn(template);

        when(templateMapper.toResponse(template))
                .thenReturn(response);

        TemplateResponse result =
                templateService.updateTemplate(
                        1L,
                        request
                );

        assertNotNull(result);

        verify(templateRepository)
                .save(any(Template.class));
    }
    @Test
    void deleteTemplate_success() {

        when(templateRepository.findById(1L))
                .thenReturn(Optional.of(template));

        doNothing().when(templateRepository)
                .delete(template);

        templateService.deleteTemplate(1L);

        verify(templateRepository)
                .findById(1L);

        verify(templateRepository)
                .delete(template);
    }


    @Test
    void deleteTemplate_notFound() {

        when(templateRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                EntityNotFoundException.class,
                () -> templateService.deleteTemplate(1L)
        );

        verify(templateRepository)
                .findById(1L);

        verify(templateRepository, never())
                .delete(any());
    }
}