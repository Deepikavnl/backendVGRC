package com.tspmquestionmaster.controller;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import com.tspmquestionmaster.dto.request.CreateQuestionRequest;
import com.tspmquestionmaster.dto.request.QuestionFilterRequest;
import com.tspmquestionmaster.dto.request.QuestionSearchRequest;
import com.tspmquestionmaster.dto.request.UpdateQuestionRequest;
import com.tspmquestionmaster.dto.response.ApiResponse;
import com.tspmquestionmaster.dto.response.QuestionResponse;
import com.tspmquestionmaster.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayInputStream;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")

public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ApiResponse<QuestionResponse> createQuestion(
            @Valid @RequestBody CreateQuestionRequest request) {

        QuestionResponse response = questionService.createQuestion(request);

        return new ApiResponse<>(true, "Question created successfully", response);
    }

    @PutMapping("/{id}")
    public ApiResponse<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuestionRequest request) {

        QuestionResponse response = questionService.updateQuestion(id, request);

        return new ApiResponse<>(true, "Question updated successfully", response);
    }

    @GetMapping("/{id}")
    public ApiResponse<QuestionResponse> getQuestionById(
            @PathVariable Long id) {

        QuestionResponse response = questionService.getQuestionById(id);

        return new ApiResponse<>(true, "Question fetched successfully", response);
    }

    @GetMapping
    public ApiResponse<List<QuestionResponse>> getAllQuestions() {

        List<QuestionResponse> response = questionService.getAllQuestions();

        return new ApiResponse<>(true, "Questions fetched successfully", response);
    }

    @PostMapping("/search")
    public ApiResponse<List<QuestionResponse>> searchQuestions(
            @RequestBody QuestionSearchRequest request) {

        List<QuestionResponse> response = questionService.searchQuestions(request);

        return new ApiResponse<>(true, "Search completed", response);
    }
    @GetMapping("/page")
    public ApiResponse<Page<QuestionResponse>> getQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Page<QuestionResponse> response =
                questionService.getQuestions(page, size, sortBy, direction);

        return new ApiResponse<>(
                true,
                "Questions fetched successfully",
                response
        );
    }
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
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteQuestion(
            @PathVariable Long id) {

        questionService.deleteQuestion(id);

        return new ApiResponse<>(true, "Question deleted successfully", null);
    }
    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportQuestions() {

        ByteArrayInputStream csv = questionService.exportQuestions();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=questions.csv"
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(csv));
    }
}