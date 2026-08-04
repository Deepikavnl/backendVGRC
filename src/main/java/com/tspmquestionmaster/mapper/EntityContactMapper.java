package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.request.CreateEntityContactRequest;
import com.tspmquestionmaster.dto.request.UpdateEntityContactRequest;
import com.tspmquestionmaster.dto.response.EntityContactResponse;
import com.tspmquestionmaster.entity.EntityContact;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import org.springframework.stereotype.Component;

@Component
public class EntityContactMapper {

    public EntityContact toEntity(CreateEntityContactRequest request,
                                  ThirdPartyEntity entity) {

        EntityContact contact = new EntityContact();

        contact.setName(request.getName());
        contact.setTitle(request.getTitle());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setPrimaryContact(request.getPrimaryContact());
        contact.setEntity(entity);

        return contact;
    }

    public void updateEntity(UpdateEntityContactRequest request,
                             EntityContact contact,
                             ThirdPartyEntity entity) {

        contact.setName(request.getName());
        contact.setTitle(request.getTitle());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setPrimaryContact(request.getPrimaryContact());
        contact.setEntity(entity);
    }

    public EntityContactResponse toResponse(EntityContact contact) {

        EntityContactResponse response = new EntityContactResponse();

        response.setId(contact.getId());
        response.setEntityId(contact.getEntity().getId());
        response.setEntityName(contact.getEntity().getName());

        response.setName(contact.getName());
        response.setTitle(contact.getTitle());
        response.setEmail(contact.getEmail());
        response.setPhone(contact.getPhone());
        response.setPrimaryContact(contact.getPrimaryContact());

        return response;
    }
}