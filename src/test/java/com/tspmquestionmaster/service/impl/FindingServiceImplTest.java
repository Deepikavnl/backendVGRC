package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.CreateFindingRequest;
import com.tspmquestionmaster.dto.response.FindingResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Finding;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.enums.FindingSeverity;
import com.tspmquestionmaster.enums.FindingStatus;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.FindingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FindingServiceImplTest {

    @Mock
    private FindingRepository findingRepository;

    @Mock
    private EntityAssessmentRepository assessmentRepository;

    @InjectMocks
    private FindingServiceImpl findingService;

    private EntityAssessment assessment;
    private ThirdPartyEntity entity;
    private Finding finding;

    @BeforeEach
    void setUp() {

        entity = new ThirdPartyEntity();
        entity.setId(1L);
        entity.setName("ABC Vendor");

        assessment = new EntityAssessment();
        assessment.setId(10L);
        assessment.setEntity(entity);

        finding = new Finding();
        finding.setId(100L);
        finding.setCode("FND-001");
        finding.setTitle("Weak Password");
        finding.setDescription("Password issue");
        finding.setSeverity(FindingSeverity.HIGH);
        finding.setStatus(FindingStatus.OPEN);
        finding.setOwner("Security Team");
        finding.setAssessment(assessment);
    }

    @Test
    void createFinding_success() {

        CreateFindingRequest request = new CreateFindingRequest();
        request.setAssessmentId(10L);
        request.setTitle("Weak Password");
        request.setDescription("Password issue");
        request.setSeverity("HIGH");
        request.setOwner("Security Team");
        request.setRecommendation("Use strong passwords");
        request.setTopic("Authentication");
        request.setQuestionId(1L);

        when(assessmentRepository.findById(10L))
                .thenReturn(Optional.of(assessment));

        when(findingRepository.save(ArgumentMatchers.any(Finding.class)))
                .thenAnswer(invocation -> {
                    Finding f = invocation.getArgument(0);
                    f.setId(100L);
                    return f;
                });

        FindingResponse response = findingService.createFinding(request);

        assertNotNull(response);
        assertEquals("Weak Password", response.getTitle());
        assertEquals("HIGH", response.getSeverity());
        assertEquals("OPEN", response.getStatus());

        verify(assessmentRepository).findById(10L);
        verify(findingRepository).save(any(Finding.class));
    }

    @Test
    void createFinding_assessmentNotFound() {

        CreateFindingRequest request = new CreateFindingRequest();
        request.setAssessmentId(99L);

        when(assessmentRepository.findById(99L))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> findingService.createFinding(request)
        );

        assertEquals("Assessment not found", ex.getMessage());

        verify(findingRepository, never()).save(any());
    }

    @Test
    void getAllFindings_success() {

        when(findingRepository.findAll())
                .thenReturn(Arrays.asList(finding));

        List<FindingResponse> result =
                findingService.getAllFindings();

        assertEquals(1, result.size());
        assertEquals("Weak Password", result.get(0).getTitle());

        verify(findingRepository).findAll();
    }

    @Test
    void getFindingById_success() {

        when(findingRepository.findById(100L))
                .thenReturn(Optional.of(finding));

        FindingResponse response =
                findingService.getFindingById(100L);

        assertNotNull(response);
        assertEquals("Weak Password", response.getTitle());

        verify(findingRepository).findById(100L);
    }

    @Test
    void getFindingById_notFound() {

        when(findingRepository.findById(100L))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> findingService.getFindingById(100L)
        );

        assertEquals("Finding not found", ex.getMessage());
    }

    @Test
    void updateStatus_success() {

        when(findingRepository.findById(100L))
                .thenReturn(Optional.of(finding));

        when(findingRepository.save(any(Finding.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        FindingResponse response =
                findingService.updateStatus(100L, "RESOLVED");

        assertEquals("RESOLVED", response.getStatus());

        verify(findingRepository).save(any(Finding.class));
    }

    @Test
    void updateStatus_notFound() {

        when(findingRepository.findById(100L))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> findingService.updateStatus(100L, "OPEN")
        );

        assertEquals("Finding not found", ex.getMessage());
    }
}