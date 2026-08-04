package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.request.CreateQuestionRequest;
import com.tspmquestionmaster.dto.request.QuestionFilterRequest;
import com.tspmquestionmaster.dto.request.QuestionSearchRequest;
import com.tspmquestionmaster.dto.request.UpdateQuestionRequest;
import com.tspmquestionmaster.dto.response.QuestionResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.io.ByteArrayInputStream;
public interface QuestionService {

    /**
     * Create Question
     */
    QuestionResponse createQuestion(CreateQuestionRequest request);

    /**
     * Update Question
     */
    QuestionResponse updateQuestion(Long id, UpdateQuestionRequest request);

    /**
     * Get Question By Id
     */
    QuestionResponse getQuestionById(Long id);

    /**
     * Get All Questions
     */
    List<QuestionResponse> getAllQuestions();

    /**
     * Get Questions with Pagination & Sorting
     */
    Page<QuestionResponse> getQuestions(
            int page,
            int size,
            String sortBy,
            String direction
    );

    /**
     * Search Questions
     */
    List<QuestionResponse> searchQuestions(QuestionSearchRequest request);

    /**
     * Filter Questions
     */
    List<QuestionResponse> filterQuestions(QuestionFilterRequest request);

    /**
     * Delete Question
     */
    void deleteQuestion(Long id);
    ByteArrayInputStream exportQuestions();
}