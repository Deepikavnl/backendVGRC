package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.request.CreateEntityDocumentRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityDocumentRequest;
import com.tspmquestionmaster.dto.response.EntityDocumentResponse;
import com.tspmquestionmaster.entity.EntityDocument;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class EntityDocumentMapper {

    public EntityDocument toEntity(
            CreateEntityDocumentRequest request,
            ThirdPartyEntity entity) {

        EntityDocument document = new EntityDocument();

        document.setName(request.getName());
        document.setFileName(request.getFileName());
        document.setFileType(request.getFileType());
        document.setSize(request.getSize());
        document.setUploadedAt(LocalDate.now());
        document.setEntity(entity);

        return document;
    }

    public void updateEntity(
            UpdateEntityDocumentRequest request,
            EntityDocument document,
            ThirdPartyEntity entity) {

        document.setName(request.getName());
        document.setFileName(request.getFileName());
        document.setFileType(request.getFileType());
        document.setSize(request.getSize());
        document.setEntity(entity);
    }

    public EntityDocumentResponse toResponse(EntityDocument document) {

        EntityDocumentResponse response = new EntityDocumentResponse();

        response.setId(document.getId());
        response.setEntityId(document.getEntity().getId());
        response.setEntityName(document.getEntity().getName());

        response.setName(document.getName());
        response.setFileName(document.getFileName());
        response.setFileType(document.getFileType());
        response.setSize(document.getSize());
        response.setUploadedAt(document.getUploadedAt());

        return response;
    }
}