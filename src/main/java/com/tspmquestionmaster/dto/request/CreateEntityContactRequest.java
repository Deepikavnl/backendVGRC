package com.tspmquestionmaster.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEntityContactRequest {

    @NotNull(message = "Entity Id is required")
    private Long entityId;

    @NotBlank(message = "Name is required")
    private String name;

    private String title;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    private String phone;

    @NotNull(message = "Primary Contact is required")
    private Boolean primaryContact;
}