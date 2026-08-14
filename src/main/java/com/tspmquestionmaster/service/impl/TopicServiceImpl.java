package com.tspmquestionmaster.service.impl;
import com.tspmquestionmaster.enums.TopicStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.tspmquestionmaster.dto.request.CreateTopicRequest;
import com.tspmquestionmaster.dto.request.TopicFilterRequest;
import com.tspmquestionmaster.dto.request.TopicSearchRequest;
import com.tspmquestionmaster.dto.request.UpdateTopicRequest;
import com.tspmquestionmaster.dto.response.TopicResponse;
import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.exception.DuplicateResourceException;
import com.tspmquestionmaster.exception.ResourceNotFoundException;
import com.tspmquestionmaster.mapper.TopicMapper;
import com.tspmquestionmaster.repository.TopicRepository;
import com.tspmquestionmaster.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.tspmquestionmaster.dto.response.TopicQuestionResponse;
import com.tspmquestionmaster.entity.Question;
import java.util.List;
import com.tspmquestionmaster.repository.QuestionRepository;
@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    private final QuestionRepository questionRepository;


    @Override
    public TopicResponse createTopic(CreateTopicRequest request) {

        if (topicRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Topic already exists : " + request.getName());
        }

        Topic topic = new Topic();
        topic.setName(request.getName());
        topic.setDescription(request.getDescription());
        topic.setColor(request.getColor());
        topic.setStatus(TopicStatus.ACTIVE);

        Topic savedTopic = topicRepository.save(topic);
        return buildTopicResponse(savedTopic);
    }

    @Override
    public TopicResponse updateTopic(Long id, UpdateTopicRequest request) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Topic not found with id : " + id));

        if (!topic.getName().equals(request.getName())
                && topicRepository.existsByName(request.getName())) {

            throw new DuplicateResourceException(
                    "Topic already exists : " + request.getName());
        }

        topic.setName(request.getName());
        topic.setDescription(request.getDescription());
        topic.setColor(request.getColor());
        topic.setStatus(request.getStatus());

        Topic updatedTopic = topicRepository.save(topic);

        return buildTopicResponse(updatedTopic);
    }
    @Override
    public Page<TopicResponse> getTopics(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Topic> topicPage = topicRepository.findAll(pageable);

        return topicPage.map(this::buildTopicResponse);
    }

    @Override
    public TopicResponse getTopicById(Long id) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Topic not found with id : " + id));

        return buildTopicResponse(topic);
    }

    @Override
    public List<TopicResponse> getAllTopics() {

        return topicRepository.findAll()
                .stream()
                .map(this::buildTopicResponse)
                .toList();
    }

    @Override
    public List<TopicResponse> searchTopics(TopicSearchRequest request) {

        return topicRepository.findAll()
                .stream()
                .filter(topic ->
                        topic.getName().toLowerCase()
                                .contains(request.getKeyword().toLowerCase()))
                .map(this::buildTopicResponse)
                .toList();
    }

    @Override
    public List<TopicResponse> filterTopics(TopicFilterRequest request) {

        return topicRepository.findAll()
                .stream()
                .filter(topic ->
                        request.getStatus() == null ||
                                topic.getStatus() == request.getStatus())
                .map(this::buildTopicResponse)
                .toList();
    }

    @Override
    public void deleteTopic(Long id) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Topic not found with id : " + id));

        topicRepository.delete(topic);
    }
    private TopicResponse buildTopicResponse(Topic topic) {

        TopicResponse response = topicMapper.toResponse(topic);

        // Set question count
        response.setQuestionCount(
                questionRepository.countByTopicId(topic.getId())
        );

        // Fetch questions for this topic
        List<TopicQuestionResponse> questionResponses = questionRepository
                .findByTopicId(topic.getId())
                .stream()
                .map(question -> {
                    TopicQuestionResponse questionResponse = new TopicQuestionResponse();

                    questionResponse.setId(question.getId());
                    questionResponse.setCode(question.getCode());
                    questionResponse.setQuestionText(question.getQuestionText());
                    questionResponse.setQuestionType(question.getQuestionType());
                    questionResponse.setWeight(question.getWeight());
                    questionResponse.setMandatory(question.getMandatory());
                    questionResponse.setStatus(question.getStatus());

                    return questionResponse;
                })
                .toList();

        response.setQuestions(questionResponses);

        return response;
    }}