package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.TemplateRequest;
import com.tspmquestionmaster.dto.response.TemplateResponse;
import com.tspmquestionmaster.service.TemplateExportService;
import com.tspmquestionmaster.service.TemplateService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TemplateController {

    private final TemplateService templateService;

    private final TemplateExportService templateExportService;


    // =========================================================
    // CREATE TEMPLATE
    // =========================================================

    @PostMapping
    public ResponseEntity<TemplateResponse> createTemplate(
            @Valid @RequestBody TemplateRequest request
    ) {

        TemplateResponse response =
                templateService.createTemplate(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET ALL TEMPLATES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<TemplateResponse>> getAllTemplates() {

        return ResponseEntity.ok(
                templateService.getAllTemplates()
        );
    }


    // =========================================================
    // GET TEMPLATE BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<TemplateResponse> getTemplateById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                templateService.getTemplateById(id)
        );
    }


    // =========================================================
    // UPDATE TEMPLATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody TemplateRequest request
    ) {

        return ResponseEntity.ok(
                templateService.updateTemplate(
                        id,
                        request
                )
        );
    }


    // =========================================================
    // DELETE TEMPLATE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable Long id
    ) {

        templateService.deleteTemplate(id);

        return ResponseEntity
                .noContent()
                .build();
    }


    // =========================================================
    // CLONE TEMPLATE
    // =========================================================

    @PostMapping("/{id}/clone")
    public ResponseEntity<TemplateResponse> cloneTemplate(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                templateService.cloneTemplate(id)
        );
    }


    // =========================================================
    // PUBLISH TEMPLATE
    // =========================================================

    @PutMapping("/{id}/publish")
    public ResponseEntity<TemplateResponse> publishTemplate(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                templateService.publishTemplate(id)
        );
    }


    // =========================================================
    // EXPORT TEMPLATE
    // =========================================================

    @GetMapping(
            value = "/{id}/export",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    public ResponseEntity<byte[]> exportTemplate(
            @PathVariable Long id
    ) {

        byte[] file =
                templateExportService.exportTemplate(id);


        return ResponseEntity.ok()
                .header(
                        "Content-Disposition",
                        "attachment; filename=Template_"
                                + id
                                + ".xlsx"
                )
                .contentType(
                        MediaType.APPLICATION_OCTET_STREAM
                )
                .body(file);
    }
}