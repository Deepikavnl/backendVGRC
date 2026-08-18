
        package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.service.TemplateExportService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/template-export")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TemplateExportController {

    private final TemplateExportService templateExportService;


    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> exportTemplate(
            @PathVariable Long id
    ) {

        byte[] file =
                templateExportService.exportTemplate(id);


        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=template-"
                                + id
                                + ".xlsx"
                )

                .header(
                        HttpHeaders.CONTENT_TYPE,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )

                .body(file);
    }
}
