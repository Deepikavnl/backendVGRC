package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.UpdateEntityFindingRequest;

import java.util.List;

import com.tspmquestionmaster.dto.request.CreateEntityFindingRequest;

import com.tspmquestionmaster.dto.response.EntityFindingResponse;

import com.tspmquestionmaster.entity.EntityFinding;

import com.tspmquestionmaster.entity.ThirdPartyEntity;

import com.tspmquestionmaster.exception.ResourceNotFoundException;

import com.tspmquestionmaster.mapper.EntityFindingMapper;

import com.tspmquestionmaster.repository.EntityFindingRepository;

import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;

import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;



import java.time.LocalDate;

import java.util.Optional;



import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.*;



@ExtendWith(MockitoExtension.class)

class EntityFindingServiceImplTest {



    @Mock

    private EntityFindingRepository findingRepository;



    @Mock

    private ThirdPartyEntityRepository entityRepository;



    @Mock

    private EntityFindingMapper mapper;



    @InjectMocks

    private EntityFindingServiceImpl service;



    @Test

    void createFinding_ShouldCreateSuccessfully() {



        CreateEntityFindingRequest request =

                new CreateEntityFindingRequest();



        request.setEntityId(1L);

        request.setCode("F001");

        request.setTitle("Weak Password");

        request.setDescription("Password policy issue");

        request.setSeverity("HIGH");

        request.setStatus("OPEN");

        request.setAssignedTo("Reviewer");

        request.setDueDate(LocalDate.now().plusDays(10));



        ThirdPartyEntity entity = new ThirdPartyEntity();

        entity.setId(1L);



        EntityFinding finding = new EntityFinding();



        EntityFinding saved = new EntityFinding();

        saved.setId(100L);



        EntityFindingResponse response =

                new EntityFindingResponse();



        response.setId(100L);



        when(entityRepository.findById(1L))

                .thenReturn(Optional.of(entity));



        when(mapper.toEntity(request, entity))

                .thenReturn(finding);



        when(findingRepository.save(finding))

                .thenReturn(saved);



        when(mapper.toResponse(saved))

                .thenReturn(response);



        EntityFindingResponse result =

                service.createFinding(request);



        assertNotNull(result);

        assertEquals(100L, result.getId());



        verify(entityRepository).findById(1L);

        verify(mapper).toEntity(request, entity);

        verify(findingRepository).save(finding);

        verify(mapper).toResponse(saved);

    }



    @Test

    void createFinding_ShouldThrowException_WhenEntityNotFound() {



        CreateEntityFindingRequest request =

                new CreateEntityFindingRequest();



        request.setEntityId(99L);



        when(entityRepository.findById(99L))

                .thenReturn(Optional.empty());



        assertThrows(

                ResourceNotFoundException.class,

                () -> service.createFinding(request)

        );



        verify(entityRepository).findById(99L);

        verify(findingRepository, never()).save(any());

    }

    @Test

    void updateFinding_ShouldUpdateSuccessfully() {



        Long id = 1L;



        UpdateEntityFindingRequest request =

                new UpdateEntityFindingRequest();



        request.setEntityId(2L);

        request.setCode("F001");

        request.setTitle("Updated Finding");

        request.setDescription("Updated Description");

        request.setSeverity("MEDIUM");

        request.setStatus("OPEN");

        request.setAssignedTo("Reviewer");

        request.setDueDate(LocalDate.now());



        EntityFinding finding = new EntityFinding();

        finding.setId(id);



        ThirdPartyEntity entity = new ThirdPartyEntity();

        entity.setId(2L);



        EntityFinding saved = new EntityFinding();

        saved.setId(id);



        EntityFindingResponse response =

                new EntityFindingResponse();

        response.setId(id);



        when(findingRepository.findById(id))

                .thenReturn(Optional.of(finding));



        when(entityRepository.findById(2L))

                .thenReturn(Optional.of(entity));



        when(findingRepository.save(finding))

                .thenReturn(saved);



        when(mapper.toResponse(saved))

                .thenReturn(response);



        EntityFindingResponse result =

                service.updateFinding(id, request);



        assertNotNull(result);

        assertEquals(id, result.getId());



        verify(mapper)

                .updateEntity(request, finding, entity);



        verify(findingRepository)

                .save(finding);



        verify(mapper)

                .toResponse(saved);

    }



    @Test

    void updateFinding_ShouldThrowException_WhenFindingNotFound() {



        Long id = 1L;



        UpdateEntityFindingRequest request =

                new UpdateEntityFindingRequest();



        when(findingRepository.findById(id))

                .thenReturn(Optional.empty());



        assertThrows(

                ResourceNotFoundException.class,

                () -> service.updateFinding(id, request)

        );



        verify(findingRepository).findById(id);

        verify(entityRepository, never()).findById(anyLong());

    }



    @Test

    void updateFinding_ShouldThrowException_WhenEntityNotFound() {



        Long id = 1L;



        EntityFinding finding = new EntityFinding();



        UpdateEntityFindingRequest request =

                new UpdateEntityFindingRequest();



        request.setEntityId(100L);



        when(findingRepository.findById(id))

                .thenReturn(Optional.of(finding));



        when(entityRepository.findById(100L))

                .thenReturn(Optional.empty());



        assertThrows(

                ResourceNotFoundException.class,

                () -> service.updateFinding(id, request)

        );



        verify(findingRepository).findById(id);

        verify(entityRepository).findById(100L);

    }



    @Test

    void getFindingById_ShouldReturnFinding() {



        Long id = 1L;



        EntityFinding finding = new EntityFinding();

        finding.setId(id);



        EntityFindingResponse response =

                new EntityFindingResponse();



        response.setId(id);



        when(findingRepository.findById(id))

                .thenReturn(Optional.of(finding));



        when(mapper.toResponse(finding))

                .thenReturn(response);



        EntityFindingResponse result =

                service.getFindingById(id);



        assertNotNull(result);

        assertEquals(id, result.getId());



        verify(findingRepository).findById(id);

        verify(mapper).toResponse(finding);

    }

    @Test

    void getFindingById_ShouldThrowException_WhenFindingNotFound() {



        Long id = 100L;



        when(findingRepository.findById(id))

                .thenReturn(Optional.empty());



        assertThrows(

                ResourceNotFoundException.class,

                () -> service.getFindingById(id)

        );



        verify(findingRepository).findById(id);

        verifyNoInteractions(mapper);

    }



    @Test

    void getAllFindings_ShouldReturnList() {



        EntityFinding finding1 = new EntityFinding();

        finding1.setId(1L);



        EntityFinding finding2 = new EntityFinding();

        finding2.setId(2L);



        EntityFindingResponse response1 = new EntityFindingResponse();

        response1.setId(1L);



        EntityFindingResponse response2 = new EntityFindingResponse();

        response2.setId(2L);



        when(findingRepository.findAll())

                .thenReturn(List.of(finding1, finding2));



        when(mapper.toResponse(finding1))

                .thenReturn(response1);



        when(mapper.toResponse(finding2))

                .thenReturn(response2);



        List<EntityFindingResponse> result =

                service.getAllFindings();



        assertEquals(2, result.size());



        verify(findingRepository).findAll();

        verify(mapper).toResponse(finding1);

        verify(mapper).toResponse(finding2);

    }



    @Test

    void getFindingsByEntity_ShouldReturnList() {



        Long entityId = 1L;



        EntityFinding finding = new EntityFinding();

        finding.setId(1L);



        EntityFindingResponse response = new EntityFindingResponse();

        response.setId(1L);



        when(findingRepository.findByEntityId(entityId))

                .thenReturn(List.of(finding));



        when(mapper.toResponse(finding))

                .thenReturn(response);



        List<EntityFindingResponse> result =

                service.getFindingsByEntity(entityId);



        assertEquals(1, result.size());



        verify(findingRepository).findByEntityId(entityId);

        verify(mapper).toResponse(finding);

    }



    @Test

    void deleteFinding_ShouldDeleteSuccessfully() {



        Long id = 1L;



        EntityFinding finding = new EntityFinding();

        finding.setId(id);



        when(findingRepository.findById(id))

                .thenReturn(Optional.of(finding));



        service.deleteFinding(id);



        verify(findingRepository).findById(id);

        verify(findingRepository).delete(finding);

    }



    @Test

    void deleteFinding_ShouldThrowException_WhenFindingNotFound() {



        Long id = 100L;



        when(findingRepository.findById(id))

                .thenReturn(Optional.empty());



        assertThrows(

                ResourceNotFoundException.class,

                () -> service.deleteFinding(id)

        );



        verify(findingRepository).findById(id);

        verify(findingRepository, never()).delete(any());

    }



}