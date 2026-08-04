package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.request.CreateEntityContactRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityContactRequest;
import com.tspmquestionmaster.dto.response.EntityContactResponse;

import java.util.List;

public interface EntityContactService {

    /**
     * Create Contact
     */
    EntityContactResponse createContact(CreateEntityContactRequest request);

    /**
     * Update Contact
     */
    EntityContactResponse updateContact(
            Long id,
            UpdateEntityContactRequest request
    );

    /**
     * Get Contact By Id
     */
    EntityContactResponse getContactById(Long id);

    /**
     * Get All Contacts
     */
    List<EntityContactResponse> getAllContacts();

    /**
     * Get Contacts By Entity
     */
    List<EntityContactResponse> getContactsByEntity(Long entityId);

    /**
     * Delete Contact
     */
    void deleteContact(Long id);

}
