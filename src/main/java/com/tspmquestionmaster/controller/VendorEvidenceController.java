package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.VendorEvidenceResponse;
import com.tspmquestionmaster.entity.VendorEvidence;
import com.tspmquestionmaster.repository.VendorEvidenceRepository;
import com.tspmquestionmaster.service.VendorEvidenceService;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import java.nio.file.Path;
import java.nio.file.Paths;



@RestController
@RequestMapping("/api/vendor-evidence")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VendorEvidenceController {



    private final VendorEvidenceService evidenceService;

    private final VendorEvidenceRepository evidenceRepository;




    @PostMapping(
            value="/upload/{assessmentId}/{questionId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<VendorEvidenceResponse> upload(
            @PathVariable Long assessmentId,
            @PathVariable Long questionId,
            @RequestParam("file") MultipartFile file
    ){


        return ResponseEntity.ok(
                evidenceService.uploadEvidence(
                        assessmentId,
                        questionId,
                        file
                )
        );

    }





    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> view(
            @PathVariable Long id
    ){

        try {


            VendorEvidence evidence =
                    evidenceRepository.findById(id)
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Evidence not found"
                                    )
                            );



            Path path =
                    Paths.get(
                            evidence.getFilePath()
                    );



            Resource resource =
                    new UrlResource(
                            path.toUri()
                    );



            return ResponseEntity.ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    evidence.getFileType()
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\""
                                    + evidence.getFileName()
                                    + "\""
                    )
                    .body(resource);



        }
        catch(Exception e){

            return ResponseEntity.notFound()
                    .build();

        }

    }
    @GetMapping("/assessment/{assessmentId}/question/{questionId}")
    public ResponseEntity<List<VendorEvidenceResponse>> getEvidenceByQuestion(
            @PathVariable Long assessmentId,
            @PathVariable Long questionId
    ){

        return ResponseEntity.ok(
                evidenceService.getEvidenceByQuestion(
                        assessmentId,
                        questionId
                )
        );

    }


}