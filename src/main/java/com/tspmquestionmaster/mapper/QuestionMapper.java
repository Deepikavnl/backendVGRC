package com.tspmquestionmaster.mapper;

import com.tspmquestionmaster.dto.response.QuestionResponse;
import com.tspmquestionmaster.dto.response.TopicResponse;
import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.Topic;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {

    public QuestionResponse toResponse(Question question) {

        if (question == null) {
            return null;
        }

        QuestionResponse response = new QuestionResponse();

        response.setId(question.getId());
        response.setCode(question.getCode());
        response.setQuestionText(question.getQuestionText());
        response.setHelpText(question.getHelpText());
        response.setQuestionType(question.getQuestionType());
        response.setWeight(question.getWeight());
        response.setMandatory(question.getMandatory());
        response.setStatus(question.getStatus());
        response.setCreatedAt(question.getCreatedAt());
        response.setUpdatedAt(question.getUpdatedAt());

        if (question.getTopic() != null) {

            Topic topic = question.getTopic();

            TopicResponse topicResponse = new TopicResponse();

            topicResponse.setId(topic.getId());
            topicResponse.setName(topic.getName());
            topicResponse.setDescription(topic.getDescription());
            topicResponse.setColor(topic.getColor());
            topicResponse.setStatus(topic.getStatus());
            topicResponse.setCreatedAt(topic.getCreatedAt());
            topicResponse.setUpdatedAt(topic.getUpdatedAt());

            response.setTopic(topicResponse);
        }

        return response;
    }
}