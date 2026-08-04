package com.tspmquestionmaster.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntityContactResponse {

    private Long id;

    private Long entityId;

    private String entityName;

    private String name;

    private String title;

    private String email;

    private String phone;

    private Boolean primaryContact;
}