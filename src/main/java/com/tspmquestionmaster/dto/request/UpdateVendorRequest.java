package com.tspmquestionmaster.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateVendorRequest {

    @NotBlank(message = "Entity name is required")
    private String entityName;

    @NotBlank(message = "Entity code is required")
    private String entityCode;

    @NotBlank(message = "Contact person is required")
    private String contactPerson;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    private String phoneNumber;

    private String industry;

    private String country;

    private String address;

    private String status;

}