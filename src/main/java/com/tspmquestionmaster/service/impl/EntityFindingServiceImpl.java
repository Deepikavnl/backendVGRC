package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.CreateEntityFindingRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityFindingRequest;
import com.tspmquestionmaster.dto.response.EntityFindingResponse;
import com.tspmquestionmaster.entity.EntityFinding;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.EntityFindingMapper;
import com.tspmquestionmaster.repository.EntityFindingRepository;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;
import com.tspmquestionmaster.service.EntityFindingService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class EntityFindingServiceImpl implements EntityFindingService {


    private final EntityFindingRepository findingRepository;

    private final ThirdPartyEntityRepository entityRepository;

    private final EntityFindingMapper mapper;


    @Override
    public EntityFindingResponse createFinding(
            CreateEntityFindingRequest request) {


        ThirdPartyEntity entity =
                entityRepository.findById(request.getEntityId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Entity not found : "
                                                + request.getEntityId()
                                ));


        EntityFinding finding =
                mapper.toEntity(request, entity);


        EntityFinding saved =
                findingRepository.save(finding);


        return mapper.toResponse(saved);
    }



    @Override
    public EntityFindingResponse updateFinding(
            Long id,
            UpdateEntityFindingRequest request) {


        EntityFinding finding =
                findingRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Finding not found : " + id
                                ));


        ThirdPartyEntity entity =
                entityRepository.findById(request.getEntityId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Entity not found"
                                ));


        mapper.updateEntity(
                request,
                finding,
                entity
        );


        return mapper.toResponse(
                findingRepository.save(finding)
        );
    }



    @Override
    @Transactional(readOnly = true)
    public EntityFindingResponse getFindingById(Long id) {

        EntityFinding finding =
                findingRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Finding not found : " + id
                                ));


        return mapper.toResponse(finding);
    }



    @Override
    @Transactional(readOnly = true)
    public List<EntityFindingResponse> getAllFindings() {

        return findingRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }



    @Override
    @Transactional(readOnly = true)
    public List<EntityFindingResponse> getFindingsByEntity(
            Long entityId) {


        return findingRepository.findByEntityId(entityId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }



    @Override
    public void deleteFinding(Long id) {

        EntityFinding finding =
                findingRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Finding not found : " + id
                                ));


        findingRepository.delete(finding);
    }
}