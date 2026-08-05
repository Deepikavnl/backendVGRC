package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.CreateEntityRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityRequest;
import com.tspmquestionmaster.dto.response.EntityResponse;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.exception.DuplicateResourceException;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.ThirdPartyEntityMapper;
import com.tspmquestionmaster.repository.ThirdPartyEntityRepository;
import com.tspmquestionmaster.service.ThirdPartyEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tspmquestionmaster.dto.request.EntitySearchRequest;
import com.tspmquestionmaster.dto.request.EntityFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ThirdPartyEntityServiceImpl implements ThirdPartyEntityService {

    private final ThirdPartyEntityRepository repository;
    private final ThirdPartyEntityMapper mapper;
    @Override
    public EntityResponse createEntity(CreateEntityRequest request) {

        if (repository.existsByNameIgnoreCase(request.getName())) {

            throw new DuplicateResourceException(
                    "Entity already exists : " + request.getName());

        }

        ThirdPartyEntity entity = mapper.toEntity(request);

        // System managed fields
        entity.setComplianceScore(0);

        entity.setOpenFindings(0);

        ThirdPartyEntity savedEntity = repository.save(entity);

        return mapper.toResponse(savedEntity);
    }
    @Override
    public EntityResponse updateEntity(Long id, UpdateEntityRequest request) {

        ThirdPartyEntity entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Entity not found with id : " + id));

        mapper.updateEntity(request, entity);

        ThirdPartyEntity updatedEntity = repository.save(entity);

        return mapper.toResponse(updatedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public EntityResponse getEntityById(Long id) {

        ThirdPartyEntity entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Entity not found with id : " + id));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EntityResponse> getAllEntities() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
    @Override
    @Transactional(readOnly = true)
    public Page<EntityResponse> getEntities(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ThirdPartyEntity> entityPage = repository.findAll(pageable);

        return entityPage.map(mapper::toResponse);
    }
    @Override
    @Transactional(readOnly = true)
    public List<EntityResponse> searchEntities(
            EntitySearchRequest request) {

        List<ThirdPartyEntity> entities;

        if (request.getKeyword() == null ||
                request.getKeyword().trim().isEmpty()) {

            entities = repository.findAll();

        } else {

            entities = repository.findByNameContainingIgnoreCase(
                    request.getKeyword().trim());

        }

        return entities.stream()
                .map(mapper::toResponse)
                .toList();
    }
    @Override
    @Transactional(readOnly = true)
    public List<EntityResponse> filterEntities(
            EntityFilterRequest request) {

        List<ThirdPartyEntity> entities = repository.findAll();

        return entities.stream()

                .filter(entity ->
                        request.getType() == null ||
                                entity.getType().equalsIgnoreCase(request.getType()))

                .filter(entity ->
                        request.getRiskRating() == null ||
                                entity.getRiskRating().equalsIgnoreCase(request.getRiskRating()))

                .filter(entity ->
                        request.getStatus() == null ||
                                entity.getStatus().equalsIgnoreCase(request.getStatus()))

                .filter(entity ->
                        request.getCountry() == null ||
                                entity.getCountry().equalsIgnoreCase(request.getCountry()))

                .filter(entity ->
                        request.getCategory() == null ||
                                entity.getCategory().equalsIgnoreCase(request.getCategory()))

                .map(mapper::toResponse)
                .toList();
    }
    @Override
    public void deleteEntity(Long id) {

        ThirdPartyEntity entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Entity not found with id : " + id));

        repository.delete(entity);
    }
}