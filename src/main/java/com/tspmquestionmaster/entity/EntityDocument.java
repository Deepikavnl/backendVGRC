package com.tspmquestionmaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "entity_documents")
public class EntityDocument extends BaseEntity {

    @Column(name = "document_name", nullable = false, length = 250)
    private String name;

    @Column(name = "file_name", nullable = false, length = 250)
    private String fileName;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "file_size")
    private Long size;

    @Column(name = "uploaded_at")
    private LocalDate uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private ThirdPartyEntity entity;
}