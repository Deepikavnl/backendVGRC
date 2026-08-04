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
import com.tspmquestionmaster.service.EntityContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class EntityContactServiceImpl implements EntityContactService {

    private final EntityContactRepository contactRepository;

    private final ThirdPartyEntityRepository entityRepository;

    private final EntityContactMapper mapper;

    @Override
    public EntityContactResponse createContact(
            CreateEntityContactRequest request) {

        ThirdPartyEntity entity = entityRepository.findById(request.getEntityId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Entity not found : " + request.getEntityId()));

        EntityContact contact = mapper.toEntity(request, entity);

        EntityContact saved = contactRepository.save(contact);

        return mapper.toResponse(saved);
    }
    @Override
    public EntityContactResponse updateContact(
            Long id,
            UpdateEntityContactRequest request) {

        EntityContact contact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found : " + id));

        ThirdPartyEntity entity = entityRepository.findById(request.getEntityId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Entity not found : " + request.getEntityId()));

        mapper.updateEntity(request, contact, entity);

        EntityContact updated = contactRepository.save(contact);

        return mapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public EntityContactResponse getContactById(Long id) {

        EntityContact contact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found : " + id));

        return mapper.toResponse(contact);
    }
    @Override
    @Transactional(readOnly = true)
    public List<EntityContactResponse> getAllContacts() {

        return contactRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EntityContactResponse> getContactsByEntity(Long entityId) {

        return contactRepository.findByEntityId(entityId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void deleteContact(Long id) {

        EntityContact contact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found : " + id));

        contactRepository.delete(contact);
    }
}