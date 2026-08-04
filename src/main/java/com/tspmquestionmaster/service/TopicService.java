package com.tspmquestionmaster.service;
import org.springframework.data.domain.Page;
import com.tspmquestionmaster.dto.request.CreateTopicRequest;
import com.tspmquestionmaster.dto.request.TopicFilterRequest;
import com.tspmquestionmaster.dto.request.TopicSearchRequest;
import com.tspmquestionmaster.dto.request.UpdateTopicRequest;
import com.tspmquestionmaster.dto.response.TopicResponse;

import java.util.List;

public interface TopicService {

    TopicResponse createTopic(CreateTopicRequest request);

    TopicResponse updateTopic(Long id, UpdateTopicRequest request);

    TopicResponse getTopicById(Long id);
    Page<TopicResponse> getTopics(
            int page,
            int size,
            String sortBy,
            String direction
    );
    List<TopicResponse> getAllTopics();

    List<TopicResponse> searchTopics(TopicSearchRequest request);

    List<TopicResponse> filterTopics(TopicFilterRequest request);

    void deleteTopic(Long id);

}