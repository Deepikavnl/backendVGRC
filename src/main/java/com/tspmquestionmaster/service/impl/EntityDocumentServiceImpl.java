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
import com.tspmquestionmaster.service.EntityDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class EntityDocumentServiceImpl implements EntityDocumentService {

    private final EntityDocumentRepository documentRepository;

    private final ThirdPartyEntityRepository entityRepository;

    private final EntityDocumentMapper mapper;

    @Override
    public EntityDocumentResponse createDocument(
            CreateEntityDocumentRequest request) {

        ThirdPartyEntity entity = entityRepository.findById(request.getEntityId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Entity not found : " + request.getEntityId()));

        EntityDocument document = mapper.toEntity(request, entity);

        EntityDocument saved = documentRepository.save(document);

        return mapper.toResponse(saved);
    }
    @Override
    public EntityDocumentResponse updateDocument(
            Long id,
            UpdateEntityDocumentRequest request) {

        EntityDocument document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found : " + id));

        ThirdPartyEntity entity = entityRepository.findById(request.getEntityId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Entity not found : " + request.getEntityId()));

        mapper.updateEntity(request, document, entity);

        EntityDocument updated = documentRepository.save(document);

        return mapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public EntityDocumentResponse getDocumentById(Long id) {

        EntityDocument document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found : " + id));

        return mapper.toResponse(document);
    }
    @Override
    @Transactional(readOnly = true)
    public List<EntityDocumentResponse> getAllDocuments() {

        return documentRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EntityDocumentResponse> getDocumentsByEntity(Long entityId) {

        return documentRepository.findByEntityId(entityId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void deleteDocument(Long id) {

        EntityDocument document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found : " + id));

        documentRepository.delete(document);
    }
}