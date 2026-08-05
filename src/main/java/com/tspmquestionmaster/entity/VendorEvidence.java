package com.tspmquestionmaster.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "vendor_evidence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorEvidence extends BaseEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private EntityAssessment assessment;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;



    @Column(name = "file_name", nullable = false)
    private String fileName;



    @Column(name = "file_type")
    private String fileType;



    @Column(name = "file_size")
    private Long fileSize;



    @Column(name = "file_path", nullable = false)
    private String filePath;



    @Column(name = "uploaded_by")
    private String uploadedBy;



    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;



    @PrePersist
    public void onCreate(){

        uploadedAt = LocalDateTime.now();

    }

}