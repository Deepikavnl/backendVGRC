package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.service.ExcelTemplateService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExcelTemplateController {

    private final ExcelTemplateService excelTemplateService;

    @GetMapping("/import-template")
    public ResponseEntity<byte[]> downloadImportTemplate() {

        byte[] file =
                excelTemplateService
                        .generateQuestionImportTemplate();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Question_Import_Template.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(file);
    }
}