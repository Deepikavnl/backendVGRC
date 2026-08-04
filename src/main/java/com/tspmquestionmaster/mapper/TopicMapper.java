package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.response.TopicResponse;
import com.tspmquestionmaster.entity.Topic;
import org.springframework.stereotype.Component;

@Component
public class TopicMapper {

    public TopicResponse toResponse(Topic topic) {

        if (topic == null) {
            return null;
        }

        TopicResponse response = new TopicResponse();

        response.setId(topic.getId());
        response.setName(topic.getName());
        response.setDescription(topic.getDescription());
        response.setColor(topic.getColor());
        response.setStatus(topic.getStatus());
        response.setCreatedAt(topic.getCreatedAt());
        response.setUpdatedAt(topic.getUpdatedAt());
        return response;
    }

}