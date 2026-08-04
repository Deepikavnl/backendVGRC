package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.CreateEntityContactRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityContactRequest;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.EntityContactResponse;
import com.tspmquestionmaster.service.EntityContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entity-contacts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EntityContactController {

    private final EntityContactService entityContactService;

    @PostMapping
    public ApiResponse<EntityContactResponse> createContact(
            @Valid @RequestBody CreateEntityContactRequest request) {

        EntityContactResponse response =
                entityContactService.createContact(request);

        return new ApiResponse<>(
                true,
                "Contact created successfully",
                response
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<EntityContactResponse> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEntityContactRequest request) {

        EntityContactResponse response =
                entityContactService.updateContact(id, request);

        return new ApiResponse<>(
                true,
                "Contact updated successfully",
                response
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<EntityContactResponse> getContactById(
            @PathVariable Long id) {

        EntityContactResponse response =
                entityContactService.getContactById(id);

        return new ApiResponse<>(
                true,
                "Contact fetched successfully",
                response
        );
    }

    @GetMapping
    public ApiResponse<List<EntityContactResponse>> getAllContacts() {

        List<EntityContactResponse> response =
                entityContactService.getAllContacts();

        return new ApiResponse<>(
                true,
                "Contacts fetched successfully",
                response
        );
    }

    @GetMapping("/entity/{entityId}")
    public ApiResponse<List<EntityContactResponse>> getContactsByEntity(
            @PathVariable Long entityId) {

        List<EntityContactResponse> response =
                entityContactService.getContactsByEntity(entityId);

        return new ApiResponse<>(
                true,
                "Contacts fetched successfully",
                response
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteContact(
            @PathVariable Long id) {

        entityContactService.deleteContact(id);

        return new ApiResponse<>(
                true,
                "Contact deleted successfully",
                null
        );
    }
}