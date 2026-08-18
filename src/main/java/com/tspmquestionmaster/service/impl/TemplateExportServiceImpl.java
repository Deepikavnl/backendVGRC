package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.Template;
import com.tspmquestionmaster.entity.TemplateTopicMapping;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.repository.TemplateRepository;
import com.tspmquestionmaster.service.TemplateExportService;

import lombok.RequiredArgsConstructor;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TemplateExportServiceImpl implements TemplateExportService {

    private final TemplateRepository templateRepository;
    private final QuestionRepository questionRepository;

    @Override
    public byte[] exportTemplate(Long templateId) {

        Template template = templateRepository.findById(templateId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Template not found: " + templateId
                        )
                );

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()
        ) {

            Sheet sheet = workbook.createSheet("Template");

            // =====================================================
            // HEADER
            // =====================================================

            Row header = sheet.createRow(0);

            header.createCell(0).setCellValue("Template");
            header.createCell(1).setCellValue("Topic");
            header.createCell(2).setCellValue("Question Code");
            header.createCell(3).setCellValue("Question");
            header.createCell(4).setCellValue("Question Type");
            header.createCell(5).setCellValue("Mandatory");
            header.createCell(6).setCellValue("Weight");

            // =====================================================
            // HEADER STYLE
            // =====================================================

            CellStyle headerStyle = workbook.createCellStyle();

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);

            headerStyle.setFont(headerFont);

            for (int i = 0; i <= 6; i++) {
                header.getCell(i).setCellStyle(headerStyle);
            }

            // =====================================================
            // DATA
            // =====================================================

            int rowNumber = 1;

            if (template.getTopics() != null) {

                for (TemplateTopicMapping mapping : template.getTopics()) {

                    if (mapping == null || mapping.getTopic() == null) {
                        continue;
                    }

                    Long topicId = mapping.getTopic().getId();

                    String topicName = mapping.getTopic().getName();

                    /*
                     * Load questions using QuestionRepository
                     * instead of topic.getQuestions().
                     */
                    List<Question> questions =
                            questionRepository.findByTopicId(topicId);

                    if (questions != null && !questions.isEmpty()) {

                        for (Question question : questions) {

                            Row row = sheet.createRow(rowNumber++);

                            row.createCell(0)
                                    .setCellValue(
                                            template.getName() != null
                                                    ? template.getName()
                                                    : ""
                                    );

                            row.createCell(1)
                                    .setCellValue(
                                            topicName != null
                                                    ? topicName
                                                    : ""
                                    );

                            row.createCell(2)
                                    .setCellValue(
                                            question.getCode() != null
                                                    ? question.getCode()
                                                    : ""
                                    );

                            row.createCell(3)
                                    .setCellValue(
                                            question.getQuestionText() != null
                                                    ? question.getQuestionText()
                                                    : ""
                                    );

                            row.createCell(4)
                                    .setCellValue(
                                            question.getQuestionType() != null
                                                    ? question.getQuestionType().name()
                                                    : ""
                                    );

                            row.createCell(5)
                                    .setCellValue(
                                            Boolean.TRUE.equals(
                                                    question.getMandatory()
                                            )
                                    );

                            row.createCell(6)
                                    .setCellValue(
                                            question.getWeight() != null
                                                    ? question.getWeight()
                                                    : 0
                                    );
                        }

                    } else {

                        // Topic exists but has no questions

                        Row row = sheet.createRow(rowNumber++);

                        row.createCell(0)
                                .setCellValue(
                                        template.getName() != null
                                                ? template.getName()
                                                : ""
                                );

                        row.createCell(1)
                                .setCellValue(
                                        topicName != null
                                                ? topicName
                                                : ""
                                );
                    }
                }
            }

            // =====================================================
            // AUTO SIZE
            // =====================================================

            for (int i = 0; i <= 6; i++) {
                sheet.autoSizeColumn(i);
            }

            // =====================================================
            // WRITE EXCEL
            // =====================================================

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Template export failed: " + e.getMessage(),
                    e
            );
        }
    }
}