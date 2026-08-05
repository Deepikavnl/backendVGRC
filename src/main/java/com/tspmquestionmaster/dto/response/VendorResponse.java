package com.tspmquestionmaster.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {

    private Long id;

    private String entityName;

    private String entityCode;

    private String contactPerson;

    private String email;

    private String phoneNumber;

    private String industry;

    private String country;

    private String address;

    private String status;

}