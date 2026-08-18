package com.tspmquestionmaster.controller;
import com.tspmquestionmaster.service.TopicImportService;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.tspmquestionmaster.dto.request.CreateTopicRequest;
import com.tspmquestionmaster.dto.request.UpdateTopicRequest;
import com.tspmquestionmaster.dto.response.TopicResponse;
import com.tspmquestionmaster.service.ExcelTemplateService;
import com.tspmquestionmaster.service.TopicService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TopicController {

    private final TopicService topicService;

    private final ExcelTemplateService excelTemplateService;
    private final TopicImportService topicImportService;

    // =========================================================
    // CREATE TOPIC
    // =========================================================

    @PostMapping
    public ResponseEntity<TopicResponse> createTopic(
            @Valid @RequestBody CreateTopicRequest request
    ) {

        return ResponseEntity.ok(
                topicService.createTopic(request)
        );
    }


    // =========================================================
    // GET ALL TOPICS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<TopicResponse>> getAllTopics() {

        return ResponseEntity.ok(
                topicService.getAllTopics()
        );
    }


    // =========================================================
    // DOWNLOAD TOPIC IMPORT TEMPLATE
    // GET /api/topics/import-template
    // =========================================================

    @GetMapping("/import-template")
    public ResponseEntity<byte[]> downloadImportTemplate() {

        byte[] file =
                excelTemplateService.generateTopicImportTemplate();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Topic_Import_Template.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(file);
    }


    // =========================================================
    // GET TOPIC BY ID
    // =========================================================

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<TopicResponse> getTopicById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                topicService.getTopicById(id)
        );
    }


    // =========================================================
    // UPDATE TOPIC
    // =========================================================

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<TopicResponse> updateTopic(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTopicRequest request
    ) {

        return ResponseEntity.ok(
                topicService.updateTopic(id, request)
        );
    }


    // =========================================================
    // DELETE TOPIC
    // =========================================================

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> deleteTopic(
            @PathVariable Long id
    ) {

        topicService.deleteTopic(id);

        return ResponseEntity.noContent().build();
    }
    @PostMapping(
            value = "/import",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> importTopics(
            @RequestParam("file") MultipartFile file
    ) {

        int importedCount =
                topicImportService.importTopics(file);

        return ResponseEntity.ok(
                importedCount +
                        " topics imported successfully"
        );
    }
}