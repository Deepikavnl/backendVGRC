package com.tspmquestionmaster.service;

import org.springframework.web.multipart.MultipartFile;

public interface QuestionImportService {

    int importQuestions(MultipartFile file);
}