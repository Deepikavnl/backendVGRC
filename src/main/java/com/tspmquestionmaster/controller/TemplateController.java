package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.TemplateRequest;
import com.tspmquestionmaster.dto.response.TemplateResponse;
import com.tspmquestionmaster.service.TemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TemplateController {

    private final TemplateService templateService;

    @PostMapping
    public ResponseEntity<TemplateResponse> createTemplate(
            @Valid @RequestBody TemplateRequest request
    ) {

        TemplateResponse response = templateService.createTemplate(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<TemplateResponse>> getAllTemplates() {

        return ResponseEntity.ok(
                templateService.getAllTemplates()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateResponse> getTemplateById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                templateService.getTemplateById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody TemplateRequest request
    ) {

        return ResponseEntity.ok(
                templateService.updateTemplate(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable Long id
    ) {

        templateService.deleteTemplate(id);

        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{id}/clone")
    public ResponseEntity<TemplateResponse> cloneTemplate(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                templateService.cloneTemplate(id)
        );
    }

    @PutMapping("/{id}/publish")
    public ResponseEntity<TemplateResponse> publishTemplate(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                templateService.publishTemplate(id)
        );
    }
}