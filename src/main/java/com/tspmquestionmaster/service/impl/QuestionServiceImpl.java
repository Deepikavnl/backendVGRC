package com.tspmquestionmaster.service.impl;

import java.io.ByteArrayInputStream;
import java.util.List;

import com.tspmquestionmaster.dto.request.CreateQuestionRequest;
import com.tspmquestionmaster.dto.request.QuestionFilterRequest;
import com.tspmquestionmaster.dto.request.QuestionSearchRequest;
import com.tspmquestionmaster.dto.request.UpdateQuestionRequest;
import com.tspmquestionmaster.dto.response.QuestionResponse;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.exception.DuplicateResourceException;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.QuestionMapper;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.repository.TopicRepository;
import com.tspmquestionmaster.service.QuestionService;
import com.tspmquestionmaster.util.CsvExportUtil;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final QuestionMapper questionMapper;

    public QuestionServiceImpl(
            QuestionRepository questionRepository,
            TopicRepository topicRepository,
            QuestionMapper questionMapper) {

        this.questionRepository = questionRepository;
        this.topicRepository = topicRepository;
        this.questionMapper = questionMapper;
    }

    @Override
    public QuestionResponse createQuestion(CreateQuestionRequest request) {

        if (questionRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException(
                    "Question code already exists : " + request.getCode());
        }

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Topic not found with id : " + request.getTopicId()));

        Question question = new Question();

        question.setCode(request.getCode());
        question.setQuestionText(request.getQuestionText());
        question.setHelpText(request.getHelpText());
        question.setQuestionType(request.getQuestionType());
        question.setWeight(request.getWeight());
        question.setMandatory(request.getMandatory());
        question.setStatus(request.getStatus());
        question.setTopic(topic);

        System.out.println("==================================");
        System.out.println("Question Type : " + request.getQuestionType());
        System.out.println("==================================");

        Question savedQuestion = questionRepository.save(question);

        return questionMapper.toResponse(savedQuestion);
    }

    @Override
    public QuestionResponse updateQuestion(Long id, UpdateQuestionRequest request) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id : " + id));

        if (!question.getCode().equals(request.getCode())
                && questionRepository.existsByCode(request.getCode())) {

            throw new DuplicateResourceException(
                    "Question code already exists : " + request.getCode());
        }

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Topic not found with id : " + request.getTopicId()));

        question.setCode(request.getCode());
        question.setQuestionText(request.getQuestionText());
        question.setHelpText(request.getHelpText());
        question.setQuestionType(request.getQuestionType());
        question.setWeight(request.getWeight());
        question.setMandatory(request.getMandatory());
        question.setStatus(request.getStatus());
        question.setTopic(topic);

        Question updatedQuestion = questionRepository.save(question);

        return questionMapper.toResponse(updatedQuestion);
    }
    @Override
    public Page<QuestionResponse> getQuestions(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Question> questionPage = questionRepository.findAll(pageable);

        return questionPage.map(questionMapper::toResponse);
    }

    @Override
    public List<QuestionResponse> filterQuestions(QuestionFilterRequest request) {

        List<Question> questions = questionRepository.findAll();

        return questions.stream()

                .filter(question ->
                        request.getTopicId() == null ||
                                question.getTopic().getId().equals(request.getTopicId()))

                .filter(question ->
                        request.getQuestionType() == null ||
                                question.getQuestionType() == request.getQuestionType())

                .filter(question ->
                        request.getStatus() == null ||
                                question.getStatus() == request.getStatus())

                .map(questionMapper::toResponse)

                .toList();
    }



    @Override
    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long id) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id : " + id));

        return questionMapper.toResponse(question);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> getAllQuestions() {

        List<Question> questions = questionRepository.findAll();

        return questions.stream()
                .map(questionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> searchQuestions(QuestionSearchRequest request) {

        List<Question> questions;

        if (request.getKeyword() == null || request.getKeyword().trim().isEmpty()) {
            questions = questionRepository.findAll();
        } else {
            questions = questionRepository.findByQuestionTextContainingIgnoreCase(
                    request.getKeyword().trim());
        }

        return questions.stream()
                .map(questionMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteQuestion(Long id) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id : " + id));

        questionRepository.delete(question);
    }

    @Override
    @Transactional(readOnly = true)
    public ByteArrayInputStream exportQuestions() {

        List<Question> questions = questionRepository.findAll();

        return CsvExportUtil.exportQuestions(questions);
    }

}