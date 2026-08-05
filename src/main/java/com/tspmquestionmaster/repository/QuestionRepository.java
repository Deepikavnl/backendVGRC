package com.tspmquestionmaster.repository;

import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.enums.QuestionStatus;
import com.tspmquestionmaster.enums.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    Optional<Question> findByCode(String code);

    boolean existsByCode(String code);

    List<Question> findByStatus(QuestionStatus status);

    List<Question> findByTopic(Topic topic);

    // ✅ Add this method
    List<Question> findByTopicId(Long topicId);

    List<Question> findByQuestionType(QuestionType questionType);

    List<Question> findByQuestionTextContainingIgnoreCase(String keyword);

    List<Question> findByTopicAndStatus(Topic topic, QuestionStatus status);

    List<Question> findByTopicAndQuestionType(Topic topic, QuestionType questionType);

    List<Question> findByStatusAndQuestionType(QuestionStatus status, QuestionType questionType);

    List<Question> findByTopicAndStatusAndQuestionType(
            Topic topic,
            QuestionStatus status,
            QuestionType questionType
    );

    long countByTopicId(Long topicId);
}