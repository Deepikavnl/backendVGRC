package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.entity.Question;
import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.enums.QuestionStatus;
import com.tspmquestionmaster.enums.QuestionType;
import com.tspmquestionmaster.repository.QuestionRepository;
import com.tspmquestionmaster.repository.TopicRepository;
import com.tspmquestionmaster.service.QuestionImportService;

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
public class QuestionImportServiceImpl implements QuestionImportService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;

    @Override
    public int importQuestions(MultipartFile file) {

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

            /*
             * Generate next question code.
             *
             * Example:
             * Existing count = 10
             * New question = Q011
             */
            long nextCode = questionRepository.count() + 1;

            boolean firstRow = true;

            for (Row row : sheet) {

                // =====================================================
                // SKIP HEADER
                // =====================================================

                if (firstRow) {
                    firstRow = false;
                    continue;
                }

                // =====================================================
                // SKIP COMPLETELY EMPTY ROW
                // =====================================================

                if (isRowEmpty(row, formatter)) {
                    continue;
                }

                // =====================================================
                // READ EXCEL VALUES SAFELY
                // =====================================================

                String questionText =
                        getCellValue(
                                row.getCell(0),
                                formatter
                        );

                String helpText =
                        getCellValue(
                                row.getCell(1),
                                formatter
                        );

                String questionTypeValue =
                        getCellValue(
                                row.getCell(2),
                                formatter
                        );

                String weightValue =
                        getCellValue(
                                row.getCell(3),
                                formatter
                        );

                String mandatoryValue =
                        getCellValue(
                                row.getCell(4),
                                formatter
                        );

                String statusValue =
                        getCellValue(
                                row.getCell(5),
                                formatter
                        );

                String topicName =
                        getCellValue(
                                row.getCell(6),
                                formatter
                        );

                // =====================================================
                // REQUIRED QUESTION TEXT
                // =====================================================

                if (questionText.isBlank()) {
                    continue;
                }

                // =====================================================
                // REQUIRED QUESTION TYPE
                // =====================================================

                if (questionTypeValue.isBlank()) {

                    throw new RuntimeException(
                            "Question Type is required at Excel row "
                                    + (row.getRowNum() + 1)
                    );
                }

                QuestionType questionType;

                try {

                    questionType =
                            QuestionType.valueOf(
                                    questionTypeValue
                                            .trim()
                                            .toUpperCase()
                            );

                } catch (IllegalArgumentException e) {

                    throw new RuntimeException(
                            "Invalid Question Type '"
                                    + questionTypeValue
                                    + "' at Excel row "
                                    + (row.getRowNum() + 1)
                    );
                }

                // =====================================================
                // WEIGHT
                // =====================================================

                int weight = 1;

                if (!weightValue.isBlank()) {

                    try {

                        /*
                         * DataFormatter normally gives values such as:
                         *
                         * 1
                         * 2
                         * 5
                         *
                         * It may also return 1.0 depending on Excel.
                         */

                        double numericWeight =
                                Double.parseDouble(
                                        weightValue.trim()
                                );

                        weight =
                                (int) numericWeight;

                    } catch (NumberFormatException e) {

                        throw new RuntimeException(
                                "Invalid Weight '"
                                        + weightValue
                                        + "' at Excel row "
                                        + (row.getRowNum() + 1)
                        );
                    }
                }

                // =====================================================
                // MANDATORY
                // =====================================================

                boolean mandatory = false;

                if (!mandatoryValue.isBlank()) {

                    if (
                            mandatoryValue.equalsIgnoreCase("YES")
                                    ||
                                    mandatoryValue.equalsIgnoreCase("TRUE")
                    ) {

                        mandatory = true;

                    } else if (
                            mandatoryValue.equalsIgnoreCase("NO")
                                    ||
                                    mandatoryValue.equalsIgnoreCase("FALSE")
                    ) {

                        mandatory = false;

                    } else {

                        throw new RuntimeException(
                                "Invalid Mandatory value '"
                                        + mandatoryValue
                                        + "' at Excel row "
                                        + (row.getRowNum() + 1)
                        );
                    }
                }

                // =====================================================
                // STATUS
                // =====================================================

                QuestionStatus status =
                        QuestionStatus.DRAFT;

                if (!statusValue.isBlank()) {

                    try {

                        status =
                                QuestionStatus.valueOf(
                                        statusValue
                                                .trim()
                                                .toUpperCase()
                                );

                    } catch (IllegalArgumentException e) {

                        throw new RuntimeException(
                                "Invalid Status '"
                                        + statusValue
                                        + "' at Excel row "
                                        + (row.getRowNum() + 1)
                        );
                    }
                }

                // =====================================================
                // TOPIC
                // =====================================================

                if (topicName.isBlank()) {

                    throw new RuntimeException(
                            "Topic is required at Excel row "
                                    + (row.getRowNum() + 1)
                    );
                }

                Topic topic =
                        topicRepository
                                .findByNameIgnoreCase(
                                        topicName.trim()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Topic not found: "
                                                        + topicName
                                                        + " at Excel row "
                                                        + (row.getRowNum() + 1)
                                        )
                                );

                // =====================================================
                // CREATE QUESTION
                // =====================================================

                Question question =
                        new Question();

                // Auto-generated code
                question.setCode(
                        String.format(
                                "Q%03d",
                                nextCode++
                        )
                );

                question.setQuestionText(
                        questionText.trim()
                );

                // =====================================================
                // HELP TEXT
                // =====================================================

                if (!helpText.isBlank()) {

                    question.setHelpText(
                            helpText.trim()
                    );
                }

                // =====================================================
                // QUESTION TYPE
                // =====================================================

                question.setQuestionType(
                        questionType
                );

                // =====================================================
                // WEIGHT
                // =====================================================

                question.setWeight(
                        weight
                );

                // =====================================================
                // MANDATORY
                // =====================================================

                question.setMandatory(
                        mandatory
                );

                // =====================================================
                // STATUS
                // =====================================================

                question.setStatus(
                        status
                );

                // =====================================================
                // TOPIC
                // =====================================================

                question.setTopic(
                        topic
                );

                // =====================================================
                // SAVE
                // =====================================================

                questionRepository.save(
                        question
                );

                importedCount++;
            }

            return importedCount;

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Excel import failed : "
                            + e.getMessage(),
                    e
            );
        }
    }

    // =========================================================
    // SAFELY READ CELL
    // =========================================================

    private String getCellValue(
            Cell cell,
            DataFormatter formatter
    ) {

        if (cell == null) {
            return "";
        }

        return formatter
                .formatCellValue(cell)
                .trim();
    }

    // =========================================================
    // CHECK EMPTY ROW
    // =========================================================

    private boolean isRowEmpty(
            Row row,
            DataFormatter formatter
    ) {

        if (row == null) {
            return true;
        }

        for (int i = 0; i <= 6; i++) {

            Cell cell =
                    row.getCell(i);

            if (cell != null) {

                String value =
                        formatter
                                .formatCellValue(cell)
                                .trim();

                if (!value.isEmpty()) {
                    return false;
                }
            }
        }

        return true;
    }
}