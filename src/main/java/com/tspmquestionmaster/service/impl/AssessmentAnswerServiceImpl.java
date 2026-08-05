package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.response.AssessmentAnswerResponse;
import com.tspmquestionmaster.mapper.AssessmentAnswerMapper;
import com.tspmquestionmaster.repository.AssessmentAnswerRepository;
import com.tspmquestionmaster.service.AssessmentAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AssessmentAnswerServiceImpl
        implements AssessmentAnswerService {

    private final AssessmentAnswerRepository repository;

    private final AssessmentAnswerMapper mapper;

    @Override
    public List<AssessmentAnswerResponse> getAnswersByAssessment(
            Long assessmentId
    ) {

        return repository.findByAssessmentId(assessmentId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

}