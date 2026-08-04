package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.request.CreateEntityDocumentRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityDocumentRequest;
import com.tspmquestionmaster.dto.response.EntityDocumentResponse;

import java.util.List;

public interface EntityDocumentService {

    /**
     * Create Document
     */
    EntityDocumentResponse createDocument(CreateEntityDocumentRequest request);

    /**
     * Update Document
     */
    EntityDocumentResponse updateDocument(
            Long id,
            UpdateEntityDocumentRequest request
    );

    /**
     * Get Document By Id
     */
    EntityDocumentResponse getDocumentById(Long id);

    /**
     * Get All Documents
     */
    List<EntityDocumentResponse> getAllDocuments();

    /**
     * Get Documents By Entity
     */
    List<EntityDocumentResponse> getDocumentsByEntity(Long entityId);

    /**
     * Delete Document
     */
    void deleteDocument(Long id);
}