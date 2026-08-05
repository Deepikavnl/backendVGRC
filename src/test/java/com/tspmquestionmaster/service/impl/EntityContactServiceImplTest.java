package com.tspmquestionmaster.service.impl;
import com.tspmquestionmaster.dto.request.CreateEntityContactRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityContactRequest;
import com.tspmquestionmaster.dto.response.EntityContactResponse;
import com.tspmquestionmaster.entity.EntityContact;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.EntityContactMapper;
import com.tspmquestionmaster.repository.EntityContactRepository;
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
class EntityContactServiceImplTest {

    @Mock
    private EntityContactRepository contactRepository;

    @Mock
    private ThirdPartyEntityRepository entityRepository;

    @Mock
    private EntityContactMapper mapper;

    @InjectMocks
    private EntityContactServiceImpl service;

    @Test
    void createContact_ShouldCreateSuccessfully() {

        CreateEntityContactRequest request =
                new CreateEntityContactRequest();

        request.setEntityId(1L);
        request.setName("John");
        request.setEmail("john@test.com");
        request.setPhone("9876543210");
        request.setPrimaryContact(true);

        ThirdPartyEntity entity = new ThirdPartyEntity();
        entity.setId(1L);

        EntityContact contact = new EntityContact();

        EntityContact saved = new EntityContact();
        saved.setId(100L);

        EntityContactResponse response =
                new EntityContactResponse();

        response.setId(100L);

        when(entityRepository.findById(1L))
                .thenReturn(Optional.of(entity));

        when(mapper.toEntity(request, entity))
                .thenReturn(contact);

        when(contactRepository.save(contact))
                .thenReturn(saved);

        when(mapper.toResponse(saved))
                .thenReturn(response);

        EntityContactResponse result =
                service.createContact(request);

        assertNotNull(result);
        assertEquals(100L, result.getId());

        verify(entityRepository).findById(1L);
        verify(mapper).toEntity(request, entity);
        verify(contactRepository).save(contact);
        verify(mapper).toResponse(saved);
    }

    @Test
    void createContact_ShouldThrowException_WhenEntityNotFound() {

        CreateEntityContactRequest request =
                new CreateEntityContactRequest();

        request.setEntityId(99L);

        when(entityRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.createContact(request)
        );

        verify(entityRepository).findById(99L);
        verify(contactRepository, never()).save(any());
    }
    @Test
    void updateContact_ShouldUpdateSuccessfully() {

        Long id = 1L;
        UpdateEntityContactRequest request =
                new UpdateEntityContactRequest();

        request.setEntityId(2L);
        request.setName("John Updated");
        request.setTitle("Manager");
        request.setEmail("john@test.com");
        request.setPhone("9999999999");
        request.setPrimaryContact(true);

        EntityContact contact = new EntityContact();
        contact.setId(id);

        ThirdPartyEntity entity = new ThirdPartyEntity();
        entity.setId(2L);

        EntityContact updated = new EntityContact();
        updated.setId(id);

        EntityContactResponse response =
                new EntityContactResponse();
        response.setId(id);

        when(contactRepository.findById(id))
                .thenReturn(Optional.of(contact));

        when(entityRepository.findById(2L))
                .thenReturn(Optional.of(entity));

        when(contactRepository.save(contact))
                .thenReturn(updated);

        when(mapper.toResponse(updated))
                .thenReturn(response);

        EntityContactResponse result =
                service.updateContact(id, request);

        assertNotNull(result);
        assertEquals(id, result.getId());

        verify(mapper)
                .updateEntity(request, contact, entity);

        verify(contactRepository)
                .save(contact);

        verify(mapper)
                .toResponse(updated);
    }

    @Test
    void updateContact_ShouldThrowException_WhenContactNotFound() {

        Long id = 1L;

        UpdateEntityContactRequest request =
                new UpdateEntityContactRequest();

        when(contactRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateContact(id, request)
        );

        verify(contactRepository).findById(id);
        verify(entityRepository, never()).findById(anyLong());
    }

    @Test
    void updateContact_ShouldThrowException_WhenEntityNotFound() {

        Long id = 1L;

        EntityContact contact = new EntityContact();

        UpdateEntityContactRequest request =
                new UpdateEntityContactRequest();

        request.setEntityId(100L);

        when(contactRepository.findById(id))
                .thenReturn(Optional.of(contact));

        when(entityRepository.findById(100L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.updateContact(id, request)
        );

        verify(contactRepository).findById(id);
        verify(entityRepository).findById(100L);
    }

    @Test
    void getContactById_ShouldReturnContact() {

        Long id = 1L;

        EntityContact contact = new EntityContact();
        contact.setId(id);

        EntityContactResponse response =
                new EntityContactResponse();
        response.setId(id);

        when(contactRepository.findById(id))
                .thenReturn(Optional.of(contact));

        when(mapper.toResponse(contact))
                .thenReturn(response);

        EntityContactResponse result =
                service.getContactById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());

        verify(contactRepository).findById(id);
        verify(mapper).toResponse(contact);
    }
    @Test
    void getContactById_ShouldThrowException_WhenContactNotFound() {

        Long id = 100L;

        when(contactRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.getContactById(id)
        );

        verify(contactRepository).findById(id);
        verifyNoInteractions(mapper);
    }

    @Test
    void getAllContacts_ShouldReturnList() {

        EntityContact contact1 = new EntityContact();
        contact1.setId(1L);

        EntityContact contact2 = new EntityContact();
        contact2.setId(2L);

        EntityContactResponse response1 = new EntityContactResponse();
        response1.setId(1L);

        EntityContactResponse response2 = new EntityContactResponse();
        response2.setId(2L);

        when(contactRepository.findAll())
                .thenReturn(List.of(contact1, contact2));

        when(mapper.toResponse(contact1))
                .thenReturn(response1);

        when(mapper.toResponse(contact2))
                .thenReturn(response2);

        List<EntityContactResponse> result =
                service.getAllContacts();

        assertNotNull(result);
        assertEquals(2, result.size());

        verify(contactRepository).findAll();
        verify(mapper).toResponse(contact1);
        verify(mapper).toResponse(contact2);
    }

    @Test
    void getContactsByEntity_ShouldReturnList() {

        Long entityId = 1L;

        EntityContact contact = new EntityContact();
        contact.setId(1L);

        EntityContactResponse response = new EntityContactResponse();
        response.setId(1L);

        when(contactRepository.findByEntityId(entityId))
                .thenReturn(List.of(contact));

        when(mapper.toResponse(contact))
                .thenReturn(response);

        List<EntityContactResponse> result =
                service.getContactsByEntity(entityId);

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(contactRepository).findByEntityId(entityId);
        verify(mapper).toResponse(contact);
    }

    @Test
    void deleteContact_ShouldDeleteSuccessfully() {

        Long id = 1L;

        EntityContact contact = new EntityContact();
        contact.setId(id);

        when(contactRepository.findById(id))
                .thenReturn(Optional.of(contact));

        service.deleteContact(id);

        verify(contactRepository).findById(id);
        verify(contactRepository).delete(contact);
    }

    @Test
    void deleteContact_ShouldThrowException_WhenContactNotFound() {

        Long id = 100L;

        when(contactRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.deleteContact(id)
        );

        verify(contactRepository).findById(id);
        verify(contactRepository, never()).delete(any());
    }

}