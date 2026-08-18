
        package com.tspmquestionmaster.service;

import org.springframework.web.multipart.MultipartFile;

public interface TopicImportService {

    int importTopics(
            MultipartFile file
    );
}

