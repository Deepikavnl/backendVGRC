package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.CreateEntityRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityRequest;
import com.tspmquestionmaster.dto.response.EntityResponse;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.exception.DuplicateResourceException;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.ThirdPartyEntityMapper;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;
import java.util.List;
import com.tspmquestionmaster.dto.request.EntitySearchRequest;
import com.tspmquestionmaster.dto.request.EntityFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
class ThirdPartyEntityServiceImplTest {

    @Mock
    private ThirdPartyEntityRepository repository;

    @Mock
    private ThirdPartyEntityMapper mapper;

    @InjectMocks
    private ThirdPartyEntityServiceImpl service;

    private ThirdPartyEntity entity;
    private EntityResponse response;
    private CreateEntityRequest createRequest;
    private UpdateEntityRequest updateRequest;

    @BeforeEach
    void setUp() {

        entity = new ThirdPartyEntity();
        entity.setId(1L);
        entity.setName("ABC Vendor");
        entity.setType("Vendor");
        entity.setRiskRating("HIGH");
        entity.setStatus("ACTIVE");
        entity.setCountry("India");
        entity.setCategory("IT");

        response = new EntityResponse();
        response.setId(1L);
        response.setName("ABC Vendor");

        createRequest = new CreateEntityRequest();
        createRequest.setName("ABC Vendor");
        createRequest.setType("Vendor");
        createRequest.setRiskRating("HIGH");
        createRequest.setStatus("ACTIVE");
        createRequest.setCountry("India");
        createRequest.setCategory("IT");

        updateRequest = new UpdateEntityRequest();
        updateRequest.setName("ABC Vendor Updated");
        updateRequest.setType("Vendor");
        updateRequest.setRiskRating("LOW");
        updateRequest.setStatus("ACTIVE");
        updateRequest.setCountry("India");
        updateRequest.setCategory("IT");
    }

    @Test
    void createEntity_success() {

        when(repository.existsByNameIgnoreCase("ABC Vendor"))
                .thenReturn(false);

        when(mapper.toEntity(createRequest))
                .thenReturn(entity);

        when(repository.save(entity))
                .thenReturn(entity);

        when(mapper.toResponse(entity))
                .thenReturn(response);

        EntityResponse result =
                service.createEntity(createRequest);

        assertNotNull(result);
        assertEquals("ABC Vendor", result.getName());

        verify(repository).save(entity);
    }

    @Test
    void createEntity_duplicate() {

        when(repository.existsByNameIgnoreCase("ABC Vendor"))
                .thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> service.createEntity(createRequest)
        );

        verify(repository, never())
                .save(any());
    }
    @Test
    void updateEntity_success() {

        when(repository.findById(1L))
                .thenReturn(Optional.of(entity));

        doNothing().when(mapper)
                .updateEntity(updateRequest, entity);

        when(repository.save(entity))
                .thenReturn(entity);

        when(mapper.toResponse(entity))
                .thenReturn(response);

        EntityResponse result =
                service.updateEntity(1L, updateRequest);

        assertNotNull(result);
        assertEquals("ABC Vendor", result.getName());

        verify(mapper).updateEntity(updateRequest, entity);
        verify(repository).save(entity);
    }

    @Test
    void updateEntity_notFound() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateEntity(1L, updateRequest)
        );

        verify(repository, never()).save(any());
    }

    @Test
    void getEntityById_success() {

        when(repository.findById(1L))
                .thenReturn(Optional.of(entity));

        when(mapper.toResponse(entity))
                .thenReturn(response);

        EntityResponse result =
                service.getEntityById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(repository).findById(1L);
    }

    @Test
    void getEntityById_notFound() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getEntityById(1L)
        );
    }

    @Test
    void getAllEntities_success() {

        when(repository.findAll())
                .thenReturn(List.of(entity));

        when(mapper.toResponse(entity))
                .thenReturn(response);

        List<EntityResponse> result =
                service.getAllEntities();

        assertEquals(1, result.size());
        assertEquals("ABC Vendor", result.get(0).getName());

        verify(repository).findAll();
    }

    @Test
    void searchEntities_withKeyword() {

        EntitySearchRequest search =
                new EntitySearchRequest();

        search.setKeyword("ABC");

        when(repository.findByNameContainingIgnoreCase("ABC"))
                .thenReturn(List.of(entity));

        when(mapper.toResponse(entity))
                .thenReturn(response);

        List<EntityResponse> result =
                service.searchEntities(search);

        assertEquals(1, result.size());

        verify(repository)
                .findByNameContainingIgnoreCase("ABC");
    }

    @Test
    void searchEntities_withoutKeyword() {

        EntitySearchRequest search =
                new EntitySearchRequest();

        search.setKeyword("");

        when(repository.findAll())
                .thenReturn(List.of(entity));

        when(mapper.toResponse(entity))
                .thenReturn(response);

        List<EntityResponse> result =
                service.searchEntities(search);

        assertEquals(1, result.size());

        verify(repository).findAll();
    }
    @Test
    void filterEntities_success() {

        EntityFilterRequest filter =
                new EntityFilterRequest();

        filter.setType("Vendor");
        filter.setRiskRating("HIGH");
        filter.setStatus("ACTIVE");
        filter.setCountry("India");
        filter.setCategory("IT");

        when(repository.findAll())
                .thenReturn(List.of(entity));

        when(mapper.toResponse(entity))
                .thenReturn(response);

        List<EntityResponse> result =
                service.filterEntities(filter);

        assertEquals(1, result.size());
        assertEquals("ABC Vendor", result.get(0).getName());
        verify(repository).findAll();
    }

    @Test
    void filterEntities_noMatch() {

        EntityFilterRequest filter =
                new EntityFilterRequest();

        filter.setCountry("USA");

        when(repository.findAll())
                .thenReturn(List.of(entity));

        List<EntityResponse> result =
                service.filterEntities(filter);

        assertTrue(result.isEmpty());
    }

    @Test
    void getEntities_success() {

        Pageable pageable =
                PageRequest.of(
                        0,
                        10,
                        Sort.by("name").ascending()
                );

        Page<ThirdPartyEntity> page =
                new PageImpl<>(
                        List.of(entity),
                        pageable,
                        1
                );

        when(repository.findAll(any(Pageable.class)))
                .thenReturn(page);

        when(mapper.toResponse(entity))
                .thenReturn(response);

        Page<EntityResponse> result =
                service.getEntities(
                        0,
                        10,
                        "name",
                        "ASC"
                );

        assertEquals(1, result.getTotalElements());
        assertEquals(
                "ABC Vendor",
                result.getContent().get(0).getName()
        );

        verify(repository)
                .findAll(any(Pageable.class));
    }

    @Test
    void deleteEntity_success() {

        when(repository.findById(1L))
                .thenReturn(Optional.of(entity));

        doNothing()
                .when(repository)
                .delete(entity);

        service.deleteEntity(1L);

        verify(repository).delete(entity);
    }

    @Test
    void deleteEntity_notFound() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.deleteEntity(1L)
        );

        verify(repository, never())
                .delete(any());
    }
}