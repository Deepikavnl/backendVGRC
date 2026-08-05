package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.response.AssessmentAnswerResponse;
import com.tspmquestionmaster.entity.AssessmentAnswer;
import com.tspmquestionmaster.mapper.AssessmentAnswerMapper;
import com.tspmquestionmaster.repository.AssessmentAnswerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentAnswerServiceImplTest {

    @Mock
    private AssessmentAnswerRepository repository;

    @Mock
    private AssessmentAnswerMapper mapper;

    @InjectMocks
    private AssessmentAnswerServiceImpl service;

    @Test
    void getAnswersByAssessment_ShouldReturnAnswerList() {

        // Arrange
        Long assessmentId = 1L;

        AssessmentAnswer answer1 = new AssessmentAnswer();
        AssessmentAnswer answer2 = new AssessmentAnswer();

        AssessmentAnswerResponse response1 = new AssessmentAnswerResponse();
        AssessmentAnswerResponse response2 = new AssessmentAnswerResponse();

        when(repository.findByAssessmentId(assessmentId))
                .thenReturn(Arrays.asList(answer1, answer2));

        when(mapper.toResponse(answer1)).thenReturn(response1);
        when(mapper.toResponse(answer2)).thenReturn(response2);

        // Act
        List<AssessmentAnswerResponse> result =
                service.getAnswersByAssessment(assessmentId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        verify(repository, times(1))
                .findByAssessmentId(assessmentId);

        verify(mapper, times(1))
                .toResponse(answer1);

        verify(mapper, times(1))
                .toResponse(answer2);
    }

    @Test
    void getAnswersByAssessment_ShouldReturnEmptyList() {

        // Arrange
        Long assessmentId = 1L;

        when(repository.findByAssessmentId(assessmentId))
                .thenReturn(Collections.emptyList());

        // Act
        List<AssessmentAnswerResponse> result =
                service.getAnswersByAssessment(assessmentId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(repository).findByAssessmentId(assessmentId);

        verifyNoInteractions(mapper);
    }

}