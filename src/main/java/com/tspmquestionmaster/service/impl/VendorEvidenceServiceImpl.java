package com.tspmquestionmaster.service.impl;


import com.tspmquestionmaster.dto.response.VendorEvidenceResponse;
import com.tspmquestionmaster.entity.EntityAssessment;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.VendorEvidence;
import com.tspmquestionmaster.repository.EntityAssessmentRepository;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.repository.VendorEvidenceRepository;
import com.tspmquestionmaster.service.VendorEvidenceService;
import java.util.List;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@Service
@RequiredArgsConstructor
@Transactional
public class VendorEvidenceServiceImpl
        implements VendorEvidenceService {


    private final EntityAssessmentRepository assessmentRepository;

    private final QuestionRepository questionRepository;

    private final VendorEvidenceRepository evidenceRepository;



    private final String uploadDirectory =
            "uploads/evidence/";



    @Override
    public VendorEvidenceResponse uploadEvidence(
            Long assessmentId,
            Long questionId,
            MultipartFile file
    ) {


        EntityAssessment assessment =
                assessmentRepository.findById(assessmentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assessment not found"
                                )
                        );



        Question question =
                questionRepository.findById(questionId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Question not found"
                                )
                        );



        try {


            Path directory =
                    Paths.get(uploadDirectory);


            if(!Files.exists(directory)){

                Files.createDirectories(directory);

            }



            String fileName =
                    System.currentTimeMillis()
                            + "_"
                            + file.getOriginalFilename();



            Path filePath =
                    directory.resolve(fileName);



            Files.copy(
                    file.getInputStream(),
                    filePath
            );



            VendorEvidence evidence =
                    new VendorEvidence();



            evidence.setAssessment(
                    assessment
            );


            evidence.setQuestion(
                    question
            );


            evidence.setFileName(
                    file.getOriginalFilename()
            );


            evidence.setFileType(
                    file.getContentType()
            );


            evidence.setFileSize(
                    file.getSize()
            );


            evidence.setFilePath(
                    filePath.toString()
            );


            VendorEvidence saved =
                    evidenceRepository.save(
                            evidence
                    );



            return mapToResponse(saved);



        }
        catch(IOException e){

            throw new RuntimeException(
                    "File upload failed"
            );

        }


    }




    @Override
    public VendorEvidenceResponse getEvidence(
            Long evidenceId
    ){

        VendorEvidence evidence =
                evidenceRepository.findById(evidenceId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Evidence not found"
                                )
                        );


        return mapToResponse(evidence);

    }





    private VendorEvidenceResponse mapToResponse(
            VendorEvidence evidence
    ){

        VendorEvidenceResponse response =
                new VendorEvidenceResponse();


        response.setId(
                evidence.getId()
        );


        response.setFileName(
                evidence.getFileName()
        );


        response.setFileType(
                evidence.getFileType()
        );


        response.setFileSize(
                evidence.getFileSize()
        );


        response.setViewUrl(
                "/api/vendor-evidence/"
                        + evidence.getId()
                        + "/view"
        );


        return response;

    }
    @Override
    public List<VendorEvidenceResponse> getEvidenceByQuestion(
            Long assessmentId,
            Long questionId
    ){

        EntityAssessment assessment =
                assessmentRepository.findById(assessmentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assessment not found"
                                )
                        );


        Question question =
                questionRepository.findById(questionId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Question not found"
                                )
                        );


        return evidenceRepository
                .findByAssessmentAndQuestion(
                        assessment,
                        question
                )
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

}