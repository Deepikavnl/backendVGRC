package com.tspmquestionmaster.dto.response;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class VendorEvidenceResponse {


    private Long id;


    private String fileName;


    private String fileType;


    private Long fileSize;


    private String viewUrl;


}