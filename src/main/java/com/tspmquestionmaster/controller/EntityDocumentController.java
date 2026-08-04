package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.CreateEntityDocumentRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityDocumentRequest;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.EntityDocumentResponse;
import com.tspmquestionmaster.service.EntityDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entity-documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EntityDocumentController {

    private final EntityDocumentService entityDocumentService;

    @PostMapping
    public ApiResponse<EntityDocumentResponse> createDocument(
            @Valid @RequestBody CreateEntityDocumentRequest request) {

        EntityDocumentResponse response =
                entityDocumentService.createDocument(request);

        return new ApiResponse<>(
                true,
                "Document created successfully",
                response
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<EntityDocumentResponse> updateDocument(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEntityDocumentRequest request) {

        EntityDocumentResponse response =
                entityDocumentService.updateDocument(id, request);

        return new ApiResponse<>(
                true,
                "Document updated successfully",
                response
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<EntityDocumentResponse> getDocumentById(
            @PathVariable Long id) {

        EntityDocumentResponse response =
                entityDocumentService.getDocumentById(id);

        return new ApiResponse<>(
                true,
                "Document fetched successfully",
                response
        );
    }

    @GetMapping
    public ApiResponse<List<EntityDocumentResponse>> getAllDocuments() {

        List<EntityDocumentResponse> response =
                entityDocumentService.getAllDocuments();

        return new ApiResponse<>(
                true,
                "Documents fetched successfully",
                response
        );
    }

    @GetMapping("/entity/{entityId}")
    public ApiResponse<List<EntityDocumentResponse>> getDocumentsByEntity(
            @PathVariable Long entityId) {

        List<EntityDocumentResponse> response =
                entityDocumentService.getDocumentsByEntity(entityId);

        return new ApiResponse<>(
                true,
                "Documents fetched successfully",
                response
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteDocument(
            @PathVariable Long id) {

        entityDocumentService.deleteDocument(id);

        return new ApiResponse<>(
                true,
                "Document deleted successfully",
                null
        );
    }
}