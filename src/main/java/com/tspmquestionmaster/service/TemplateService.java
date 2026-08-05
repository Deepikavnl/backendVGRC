package com.tspmquestionmaster.service;


import com.tspmquestionmaster.dto.request.TemplateRequest;
import com.tspmquestionmaster.dto.response.TemplateResponse;

import java.util.List;


public interface TemplateService {


    TemplateResponse createTemplate(
            TemplateRequest request
    );


    List<TemplateResponse> getAllTemplates();
    TemplateResponse cloneTemplate(Long id);

    TemplateResponse publishTemplate(Long id);

    TemplateResponse getTemplateById(
            Long id
    );


    TemplateResponse updateTemplate(
            Long id,
            TemplateRequest request
    );


    void deleteTemplate(
            Long id
    );

}