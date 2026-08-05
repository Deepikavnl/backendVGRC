package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.CreateEntityDocumentRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityDocumentRequest;
import com.tspmquestionmaster.dto.response.EntityDocumentResponse;
import com.tspmquestionmaster.entity.EntityDocument;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.EntityDocumentMapper;
import com.tspmquestionmaster.repository.EntityDocumentRepository;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EntityDocumentServiceImplTest {

    @Mock
    private EntityDocumentRepository documentRepository;

    @Mock
    private ThirdPartyEntityRepository entityRepository;

    @Mock
    private EntityDocumentMapper mapper;

    @InjectMocks
    private EntityDocumentServiceImpl service;

    @Test
    void createDocument_ShouldCreateSuccessfully() {

        CreateEntityDocumentRequest request =
                new CreateEntityDocumentRequest();

        request.setEntityId(1L);
        request.setName("ISO Certificate");
        request.setFileName("iso.pdf");
        request.setFileType("PDF");
        request.setSize(500L);

        ThirdPartyEntity entity = new ThirdPartyEntity();
        entity.setId(1L);

        EntityDocument document = new EntityDocument();

        EntityDocument saved = new EntityDocument();
        saved.setId(100L);

        EntityDocumentResponse response =
                new EntityDocumentResponse();
        response.setId(100L);

        when(entityRepository.findById(1L))
                .thenReturn(Optional.of(entity));

        when(mapper.toEntity(request, entity))
                .thenReturn(document);

        when(documentRepository.save(document))
                .thenReturn(saved);

        when(mapper.toResponse(saved))
                .thenReturn(response);

        EntityDocumentResponse result =
                service.createDocument(request);

        assertNotNull(result);
        assertEquals(100L, result.getId());

        verify(entityRepository).findById(1L);
        verify(mapper).toEntity(request, entity);
        verify(documentRepository).save(document);
        verify(mapper).toResponse(saved);
    }

    @Test
    void createDocument_ShouldThrowException_WhenEntityNotFound() {

        CreateEntityDocumentRequest request =
                new CreateEntityDocumentRequest();

        request.setEntityId(99L);

        when(entityRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.createDocument(request)
        );

        verify(entityRepository).findById(99L);
        verify(documentRepository, never()).save(any());
    }
    @Test
    void updateDocument_ShouldUpdateSuccessfully() {

        Long id = 1L;

        UpdateEntityDocumentRequest request =
                new UpdateEntityDocumentRequest();

        request.setEntityId(2L);
        request.setName("Updated Document");
        request.setFileName("updated.pdf");
        request.setFileType("PDF");
        request.setSize(1000L);

        EntityDocument document = new EntityDocument();
        document.setId(id);

        ThirdPartyEntity entity = new ThirdPartyEntity();
        entity.setId(2L);

        EntityDocument updated = new EntityDocument();
        updated.setId(id);

        EntityDocumentResponse response =
                new EntityDocumentResponse();
        response.setId(id);

        when(documentRepository.findById(id))
                .thenReturn(Optional.of(document));

        when(entityRepository.findById(2L))
                .thenReturn(Optional.of(entity));

        when(documentRepository.save(document))
                .thenReturn(updated);

        when(mapper.toResponse(updated))
                .thenReturn(response);

        EntityDocumentResponse result =
                service.updateDocument(id, request);

        assertNotNull(result);
        assertEquals(id, result.getId());

        verify(mapper).updateEntity(request, document, entity);
        verify(documentRepository).save(document);
        verify(mapper).toResponse(updated);
    }

    @Test
    void updateDocument_ShouldThrowException_WhenDocumentNotFound() {

        Long id = 1L;

        UpdateEntityDocumentRequest request =
                new UpdateEntityDocumentRequest();

        when(documentRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateDocument(id, request)
        );

        verify(documentRepository).findById(id);
        verify(entityRepository, never()).findById(anyLong());
    }

    @Test
    void updateDocument_ShouldThrowException_WhenEntityNotFound() {

        Long id = 1L;

        EntityDocument document = new EntityDocument();

        UpdateEntityDocumentRequest request =
                new UpdateEntityDocumentRequest();

        request.setEntityId(100L);

        when(documentRepository.findById(id))
                .thenReturn(Optional.of(document));

        when(entityRepository.findById(100L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateDocument(id, request)
        );

        verify(documentRepository).findById(id);
        verify(entityRepository).findById(100L);
    }

    @Test
    void getDocumentById_ShouldReturnDocument() {

        Long id = 1L;

        EntityDocument document = new EntityDocument();
        document.setId(id);

        EntityDocumentResponse response =
                new EntityDocumentResponse();
        response.setId(id);

        when(documentRepository.findById(id))
                .thenReturn(Optional.of(document));

        when(mapper.toResponse(document))
                .thenReturn(response);

        EntityDocumentResponse result =
                service.getDocumentById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());

        verify(documentRepository).findById(id);
        verify(mapper).toResponse(document);
    }
    @Test
    void getDocumentById_ShouldThrowException_WhenDocumentNotFound() {

        Long id = 100L;

        when(documentRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getDocumentById(id)
        );

        verify(documentRepository).findById(id);
        verifyNoInteractions(mapper);
    }

    @Test
    void getAllDocuments_ShouldReturnList() {

        EntityDocument document1 = new EntityDocument();
        document1.setId(1L);

        EntityDocument document2 = new EntityDocument();
        document2.setId(2L);

        EntityDocumentResponse response1 = new EntityDocumentResponse();
        response1.setId(1L);

        EntityDocumentResponse response2 = new EntityDocumentResponse();
        response2.setId(2L);

        when(documentRepository.findAll())
                .thenReturn(List.of(document1, document2));

        when(mapper.toResponse(document1))
                .thenReturn(response1);

        when(mapper.toResponse(document2))
                .thenReturn(response2);

        List<EntityDocumentResponse> result =
                service.getAllDocuments();

        assertNotNull(result);
        assertEquals(2, result.size());

        verify(documentRepository).findAll();
        verify(mapper).toResponse(document1);
        verify(mapper).toResponse(document2);
    }

    @Test
    void getDocumentsByEntity_ShouldReturnList() {

        Long entityId = 1L;

        EntityDocument document = new EntityDocument();
        document.setId(1L);

        EntityDocumentResponse response = new EntityDocumentResponse();
        response.setId(1L);

        when(documentRepository.findByEntityId(entityId))
                .thenReturn(List.of(document));

        when(mapper.toResponse(document))
                .thenReturn(response);

        List<EntityDocumentResponse> result =
                service.getDocumentsByEntity(entityId);

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(documentRepository).findByEntityId(entityId);
        verify(mapper).toResponse(document);
    }

    @Test
    void deleteDocument_ShouldDeleteSuccessfully() {

        Long id = 1L;

        EntityDocument document = new EntityDocument();
        document.setId(id);

        when(documentRepository.findById(id))
                .thenReturn(Optional.of(document));

        service.deleteDocument(id);

        verify(documentRepository).findById(id);
        verify(documentRepository).delete(document);
    }

    @Test
    void deleteDocument_ShouldThrowException_WhenDocumentNotFound() {

        Long id = 100L;

        when(documentRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.deleteDocument(id)
        );

        verify(documentRepository).findById(id);
        verify(documentRepository, never()).delete(any());
    }

}