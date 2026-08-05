package com.tspmquestionmaster.entity;
import com.tspmquestionmaster.enums.FindingSeverity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.tspmquestionmaster.enums.FindingStatus;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "findings")
public class Finding extends BaseEntity {


    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;


    @Column(name = "title", nullable = false, length = 250)
    private String title;


    @Column(name = "description", columnDefinition = "TEXT")
    private String description;


    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false, length = 30)
    private FindingSeverity severity;


    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private FindingStatus status;


    @Column(name = "recommendation", columnDefinition = "TEXT")
    private String recommendation;


    @Column(name = "owner", length = 150)
    private String owner;


    @Column(name = "due_date")
    private LocalDate dueDate;


    /*
       Assessment from which finding was created
    */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    private EntityAssessment assessment;



    /*
       Specific question where gap was identified
    */
    @Column(name = "question_id")
    private Long questionId;



    @Column(name = "topic", length = 150)
    private String topic;


}