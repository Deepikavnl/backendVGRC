package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.CreateQuestionRequest;
import com.tspmquestionmaster.dto.request.QuestionFilterRequest;
import com.tspmquestionmaster.dto.request.QuestionSearchRequest;
import com.tspmquestionmaster.dto.request.UpdateQuestionRequest;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.QuestionResponse;
import com.tspmquestionmaster.service.QuestionImportService;
import com.tspmquestionmaster.service.QuestionService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.InputStreamResource;

import org.springframework.data.domain.Page;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {

    private final QuestionService questionService;
    private final QuestionImportService questionImportService;

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ApiResponse<QuestionResponse> createQuestion(
            @Valid @RequestBody CreateQuestionRequest request) {

        QuestionResponse response =
                questionService.createQuestion(request);

        return new ApiResponse<>(
                true,
                "Question created successfully",
                response
        );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ApiResponse<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuestionRequest request) {

        QuestionResponse response =
                questionService.updateQuestion(id, request);

        return new ApiResponse<>(
                true,
                "Question updated successfully",
                response
        );
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ApiResponse<QuestionResponse> getQuestionById(
            @PathVariable Long id) {

        QuestionResponse response =
                questionService.getQuestionById(id);

        return new ApiResponse<>(
                true,
                "Question fetched successfully",
                response
        );
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ApiResponse<List<QuestionResponse>> getAllQuestions() {

        List<QuestionResponse> response =
                questionService.getAllQuestions();

        return new ApiResponse<>(
                true,
                "Questions fetched successfully",
                response
        );
    }

    // =========================================================
    // SEARCH
    // =========================================================

    @PostMapping("/search")
    public ApiResponse<List<QuestionResponse>> searchQuestions(
            @RequestBody QuestionSearchRequest request) {

        List<QuestionResponse> response =
                questionService.searchQuestions(request);

        return new ApiResponse<>(
                true,
                "Search completed",
                response
        );
    }

    // =========================================================
    // PAGINATION
    // =========================================================

    @GetMapping("/page")
    public ApiResponse<Page<QuestionResponse>> getQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Page<QuestionResponse> response =
                questionService.getQuestions(
                        page,
                        size,
                        sortBy,
                        direction
                );

        return new ApiResponse<>(
                true,
                "Questions fetched successfully",
                response
        );
    }

    // =========================================================
    // FILTER
    // =========================================================

    @PostMapping("/filter")
    public ApiResponse<List<QuestionResponse>> filterQuestions(
            @RequestBody QuestionFilterRequest request) {

        List<QuestionResponse> response =
                questionService.filterQuestions(request);

        return new ApiResponse<>(
                true,
                "Filter completed",
                response
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteQuestion(
            @PathVariable Long id) {

        questionService.deleteQuestion(id);

        return new ApiResponse<>(
                true,
                "Question deleted successfully",
                null
        );
    }

    // =========================================================
    // EXPORT
    // =========================================================

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportQuestions() {

        ByteArrayInputStream csv =
                questionService.exportQuestions();

        HttpHeaders headers =
                new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=questions.csv"
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(
                        MediaType.parseMediaType("text/csv")
                )
                .body(
                        new InputStreamResource(csv)
                );
    }

    // =========================================================
    // IMPORT
    // =========================================================

    @PostMapping(
            value = "/import",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> importQuestions(
            @RequestParam("file") MultipartFile file) {

        int importedCount =
                questionImportService.importQuestions(file);

        return ResponseEntity.ok(
                importedCount
                        + " questions imported successfully"
        );
    }
}