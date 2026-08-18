package com.tspmquestionmaster.service;

import org.springframework.web.multipart.MultipartFile;

public interface ExcelTemplateService {

    byte[] generateTopicImportTemplate();

    byte[] generateQuestionImportTemplate();

    void validateTemplate(MultipartFile file);
}