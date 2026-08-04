package com.tspmquestionmaster.service;
import com.tspmquestionmaster.dto.request.EntitySearchRequest;
import com.tspmquestionmaster.dto.request.EntityFilterRequest;
import org.springframework.data.domain.Page;
import com.tspmquestionmaster.dto.request.CreateEntityRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityRequest;
import com.tspmquestionmaster.dto.response.EntityResponse;
import com.tspmquestionmaster.dto.request.EntityFilterRequest;
import com.tspmquestionmaster.dto.request.EntitySearchRequest;
import org.springframework.data.domain.Page;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ThirdPartyEntityService {

    EntityResponse createEntity(CreateEntityRequest request);

    EntityResponse updateEntity(Long id, UpdateEntityRequest request);

    EntityResponse getEntityById(Long id);

    List<EntityResponse> getAllEntities();

    void deleteEntity(Long id);
    Page<EntityResponse> getEntities(
            int page,
            int size,
            String sortBy,
            String direction
    );

    List<EntityResponse> searchEntities(EntitySearchRequest request);

    List<EntityResponse> filterEntities(EntityFilterRequest request);



}