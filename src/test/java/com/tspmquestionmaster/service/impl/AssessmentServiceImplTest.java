package com.tspmquestionmaster.service.impl;
import java.util.List;
import com.tspmquestionmaster.dto.request.CreateAssessmentRequest;
import com.tspmquestionmaster.dto.response.AssessmentResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.AssessmentMapper;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import com.tspmquestionmaster.dto.request.UpdateAssessmentRequest;
import com.tspmquestionmaster.exception.DuplicateResourceException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceImplTest {

    @Mock
    private EntityAssessmentRepository entityAssessmentRepository;

    @Mock
    private ThirdPartyEntityRepository entityRepository;

    @Mock
    private AssessmentMapper mapper;

    @InjectMocks
    private AssessmentServiceImpl service;

    @Test
    void createAssessment_ShouldCreateSuccessfully() {

        CreateAssessmentRequest request = new CreateAssessmentRequest();
        request.setCode("ASM001");
        request.setEntityId(1L);
        request.setReviewerName("John");
        request.setTemplateName("ISO27001");
        request.setStatus("PENDING");
        request.setProgress(0);
        request.setDueDate(LocalDate.now().plusDays(10));

        ThirdPartyEntity entity = new ThirdPartyEntity();
        entity.setId(1L);
        entity.setName("Vendor A");

        EntityAssessment assessment = new EntityAssessment();

        EntityAssessment saved = new EntityAssessment();
        saved.setId(100L);
        saved.setCode("ASM001");

        AssessmentResponse response = new AssessmentResponse();
        response.setId(100L);
        response.setCode("ASM001");

        when(entityAssessmentRepository.existsByCode("ASM001"))
                .thenReturn(false);

        when(entityRepository.findById(1L))
                .thenReturn(Optional.of(entity));

        when(mapper.toEntity(request, entity))
                .thenReturn(assessment);

        when(entityAssessmentRepository.save(any(EntityAssessment.class)))
                .thenReturn(saved);

        when(mapper.toResponse(saved))
                .thenReturn(response);

        AssessmentResponse result =
                service.createAssessment(request);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("ASM001", result.getCode());

        verify(entityAssessmentRepository).existsByCode("ASM001");
        verify(entityRepository).findById(1L);
        verify(mapper).toEntity(request, entity);
        verify(entityAssessmentRepository).save(any(EntityAssessment.class));
        verify(mapper).toResponse(saved);
    }

    @Test
    void createAssessment_ShouldThrowException_WhenEntityNotFound() {

        CreateAssessmentRequest request = new CreateAssessmentRequest();
        request.setCode("ASM001");
        request.setEntityId(99L);

        when(entityAssessmentRepository.existsByCode("ASM001"))
                .thenReturn(false);

        when(entityRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.createAssessment(request)
        );

        verify(entityAssessmentRepository).existsByCode("ASM001");
        verify(entityRepository).findById(99L);
        verify(entityAssessmentRepository, never()).save(any());
    }
    @Test
    void createAssessment_ShouldThrowException_WhenCodeAlreadyExists() {

        CreateAssessmentRequest request = new CreateAssessmentRequest();
        request.setCode("ASM001");

        when(entityAssessmentRepository.existsByCode("ASM001"))
                .thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.createAssessment(request)
        );

        assertEquals(
                "Assessment code already exists",
                exception.getMessage()
        );

        verify(entityAssessmentRepository)
                .existsByCode("ASM001");

        verify(entityRepository, never())
                .findById(anyLong());

        verify(entityAssessmentRepository, never())
                .save(any());
    }

    @Test
    void getAssessmentById_ShouldReturnAssessment() {

        Long id = 1L;

        EntityAssessment assessment = new EntityAssessment();
        assessment.setId(id);
        assessment.setCode("ASM001");

        AssessmentResponse response = new AssessmentResponse();
        response.setId(id);
        response.setCode("ASM001");

        when(entityAssessmentRepository.findById(id))
                .thenReturn(Optional.of(assessment));

        when(mapper.toResponse(assessment))
                .thenReturn(response);

        AssessmentResponse result =
                service.getAssessmentById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
        assertEquals("ASM001", result.getCode());

        verify(entityAssessmentRepository)
                .findById(id);

        verify(mapper)
                .toResponse(assessment);
    }

    @Test
    void getAssessmentById_ShouldThrowException_WhenAssessmentNotFound() {

        Long id = 100L;

        when(entityAssessmentRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getAssessmentById(id)
        );

        verify(entityAssessmentRepository)
                .findById(id);

        verifyNoInteractions(mapper);
    }
    @Test
    void getAllAssessments_ShouldReturnList() {

        EntityAssessment assessment1 = new EntityAssessment();
        assessment1.setId(1L);
        assessment1.setCode("ASM001");

        EntityAssessment assessment2 = new EntityAssessment();
        assessment2.setId(2L);
        assessment2.setCode("ASM002");

        AssessmentResponse response1 = new AssessmentResponse();
        response1.setId(1L);

        AssessmentResponse response2 = new AssessmentResponse();
        response2.setId(2L);

        when(entityAssessmentRepository.findAll())
                .thenReturn(List.of(assessment1, assessment2));

        when(mapper.toResponse(assessment1))
                .thenReturn(response1);

        when(mapper.toResponse(assessment2))
                .thenReturn(response2);

        List<AssessmentResponse> result =
                service.getAllAssessments();

        assertNotNull(result);
        assertEquals(2, result.size());

        verify(entityAssessmentRepository).findAll();
        verify(mapper).toResponse(assessment1);
        verify(mapper).toResponse(assessment2);
    }

    @Test
    void getAllAssessments_ShouldReturnEmptyList() {

        when(entityAssessmentRepository.findAll())
                .thenReturn(List.of());

        List<AssessmentResponse> result =
                service.getAllAssessments();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(entityAssessmentRepository).findAll();
        verifyNoInteractions(mapper);
    }

    @Test
    void getAssessmentsByEntity_ShouldReturnList() {

        Long entityId = 1L;

        EntityAssessment assessment = new EntityAssessment();
        assessment.setId(1L);

        AssessmentResponse response = new AssessmentResponse();
        response.setId(1L);

        when(entityAssessmentRepository.findByEntityId(entityId))
                .thenReturn(List.of(assessment));

        when(mapper.toResponse(assessment))
                .thenReturn(response);

        List<AssessmentResponse> result =
                service.getAssessmentsByEntity(entityId);

        assertEquals(1, result.size());

        verify(entityAssessmentRepository)
                .findByEntityId(entityId);

        verify(mapper)
                .toResponse(assessment);
    }

    @Test
    void getAssessmentsByEntity_ShouldReturnEmptyList() {

        Long entityId = 1L;

        when(entityAssessmentRepository.findByEntityId(entityId))
                .thenReturn(List.of());

        List<AssessmentResponse> result =
                service.getAssessmentsByEntity(entityId);

        assertTrue(result.isEmpty());

        verify(entityAssessmentRepository)
                .findByEntityId(entityId);

        verifyNoInteractions(mapper);
    }

    @Test
    void deleteAssessment_ShouldDeleteSuccessfully() {

        Long id = 1L;

        EntityAssessment assessment = new EntityAssessment();
        assessment.setId(id);

        when(entityAssessmentRepository.findById(id))
                .thenReturn(Optional.of(assessment));

        service.deleteAssessment(id);

        verify(entityAssessmentRepository).findById(id);
        verify(entityAssessmentRepository).delete(assessment);
    }

    @Test
    void deleteAssessment_ShouldThrowException_WhenAssessmentNotFound() {

        Long id = 100L;

        when(entityAssessmentRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.deleteAssessment(id)
        );

        verify(entityAssessmentRepository).findById(id);
        verify(entityAssessmentRepository, never()).delete(any());
    }
    @Test
    void getAssessmentByToken_ShouldReturnAssessment() {

        String token = "token123";

        EntityAssessment assessment = new EntityAssessment();
        assessment.setId(1L);
        assessment.setAssessmentToken(token);

        AssessmentResponse response = new AssessmentResponse();
        response.setId(1L);
        response.setAssessmentToken(token);

        when(entityAssessmentRepository.findByAssessmentToken(token))
                .thenReturn(Optional.of(assessment));

        when(mapper.toResponse(assessment))
                .thenReturn(response);

        AssessmentResponse result =
                service.getAssessmentByToken(token);

        assertNotNull(result);
        assertEquals(token, result.getAssessmentToken());

        verify(entityAssessmentRepository)
                .findByAssessmentToken(token);

        verify(mapper)
                .toResponse(assessment);
    }

    @Test
    void getAssessmentByToken_ShouldThrowException_WhenTokenNotFound() {

        String token = "invalid-token";

        when(entityAssessmentRepository.findByAssessmentToken(token))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getAssessmentByToken(token)
        );

        verify(entityAssessmentRepository)
                .findByAssessmentToken(token);

        verifyNoInteractions(mapper);
    }

    @Test
    void updateAssessment_ShouldThrowException_WhenAssessmentNotFound() {

        Long id = 1L;

        when(entityAssessmentRepository.findById(id))
                .thenReturn(Optional.empty());

        UpdateAssessmentRequest request =
                new UpdateAssessmentRequest();

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateAssessment(id, request)
        );

        verify(entityAssessmentRepository)
                .findById(id);
    }

    @Test
    void updateAssessment_ShouldThrowDuplicateException() {

        Long id = 1L;

        EntityAssessment assessment = new EntityAssessment();
        assessment.setId(id);
        assessment.setCode("OLD");

        UpdateAssessmentRequest request =
                new UpdateAssessmentRequest();

        request.setCode("NEW");

        when(entityAssessmentRepository.findById(id))
                .thenReturn(Optional.of(assessment));

        when(entityAssessmentRepository.existsByCode("NEW"))
                .thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> service.updateAssessment(id, request)
        );

        verify(entityAssessmentRepository)
                .existsByCode("NEW");
    }

    @Test
    void updateAssessment_ShouldThrowEntityNotFound() {

        Long id = 1L;

        EntityAssessment assessment = new EntityAssessment();
        assessment.setId(id);
        assessment.setCode("ASM001");

        UpdateAssessmentRequest request =
                new UpdateAssessmentRequest();

        request.setCode("ASM001");
        request.setEntityId(100L);

        when(entityAssessmentRepository.findById(id))
                .thenReturn(Optional.of(assessment));

        when(entityRepository.findById(100L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateAssessment(id, request)
        );

        verify(entityRepository)
                .findById(100L);
    }

    @Test
    void updateAssessment_ShouldUpdateSuccessfully() {

        Long id = 1L;

        EntityAssessment assessment = new EntityAssessment();
        assessment.setId(id);
        assessment.setCode("ASM001");

        ThirdPartyEntity entity = new ThirdPartyEntity();
        entity.setId(2L);

        UpdateAssessmentRequest request =
                new UpdateAssessmentRequest();

        request.setCode("ASM001");
        request.setEntityId(2L);
        request.setTemplateName("ISO");
        request.setReviewerName("John");
        request.setStatus("IN_PROGRESS");
        request.setProgress(50);
        request.setDueDate(LocalDate.now());

        EntityAssessment updated = new EntityAssessment();
        updated.setId(id);

        AssessmentResponse response =
                new AssessmentResponse();

        response.setId(id);

        when(entityAssessmentRepository.findById(id))
                .thenReturn(Optional.of(assessment));

        when(entityRepository.findById(2L))
                .thenReturn(Optional.of(entity));

        when(entityAssessmentRepository.save(assessment))
                .thenReturn(updated);

        when(mapper.toResponse(updated))
                .thenReturn(response);

        AssessmentResponse result =
                service.updateAssessment(id, request);

        assertNotNull(result);
        assertEquals(id, result.getId());

        verify(mapper)
                .updateEntity(request, assessment, entity);

        verify(entityAssessmentRepository)
                .save(assessment);

        verify(mapper)
                .toResponse(updated);
    }

}