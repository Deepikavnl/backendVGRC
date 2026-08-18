package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.enums.TopicStatus;
import com.tspmquestionmaster.repository.TopicRepository;
import com.tspmquestionmaster.service.TopicImportService;

import lombok.RequiredArgsConstructor;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
@Transactional
public class TopicImportServiceImpl implements TopicImportService {

    private final TopicRepository topicRepository;

    @Override
    public int importTopics(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Excel file is empty");
        }

        int importedCount = 0;

        DataFormatter formatter = new DataFormatter();

        try (
                InputStream inputStream = file.getInputStream();
                Workbook workbook = WorkbookFactory.create(inputStream)
        ) {

            Sheet sheet = workbook.getSheetAt(0);

            boolean firstRow = true;

            for (Row row : sheet) {

                // Skip header
                if (firstRow) {
                    firstRow = false;
                    continue;
                }

                // =====================================================
                // EXCEL COLUMNS
                // =====================================================

                String name = getCellValue(
                        row.getCell(0),
                        formatter
                );

                String description = getCellValue(
                        row.getCell(1),
                        formatter
                );

                // Category is read from Excel but Topic currently
                // does not have a category field.
                String category = getCellValue(
                        row.getCell(2),
                        formatter
                );

                String color = getCellValue(
                        row.getCell(3),
                        formatter
                );

                String status = getCellValue(
                        row.getCell(4),
                        formatter
                );

                // =====================================================
                // REQUIRED NAME
                // =====================================================

                if (name == null || name.isBlank()) {
                    continue;
                }

                // =====================================================
                // CREATE TOPIC
                // =====================================================

                Topic topic = new Topic();

                topic.setName(name.trim());

                // =====================================================
                // DESCRIPTION
                // =====================================================

                if (description != null && !description.isBlank()) {
                    topic.setDescription(description.trim());
                }

                // =====================================================
                // COLOR
                // =====================================================

                if (color != null && !color.isBlank()) {
                    topic.setColor(color.trim());
                }

                // =====================================================
                // STATUS
                // =====================================================

                if (status != null && !status.isBlank()) {

                    try {

                        topic.setStatus(
                                TopicStatus.valueOf(
                                        status.trim().toUpperCase()
                                )
                        );

                    } catch (IllegalArgumentException ex) {

                        throw new RuntimeException(
                                "Invalid Topic Status '" +
                                        status +
                                        "' for topic '" +
                                        name +
                                        "'. Allowed values: " +
                                        java.util.Arrays.toString(
                                                TopicStatus.values()
                                        )
                        );
                    }

                } else {

                    // Default status
                    topic.setStatus(
                            TopicStatus.ACTIVE
                    );
                }

                // =====================================================
                // SAVE
                // =====================================================

                topicRepository.save(topic);

                importedCount++;
            }

            return importedCount;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Topic Excel import failed: " +
                            e.getMessage(),
                    e
            );
        }
    }

    // =========================================================
    // READ CELL
    // =========================================================

    private String getCellValue(
            Cell cell,
            DataFormatter formatter
    ) {

        if (cell == null) {
            return "";
        }

        return formatter.formatCellValue(cell);
    }
}