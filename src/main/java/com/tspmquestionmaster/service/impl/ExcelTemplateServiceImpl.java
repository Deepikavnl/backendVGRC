package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.entity.Topic;
import com.tspmquestionmaster.repository.TopicRepository;
import com.tspmquestionmaster.service.ExcelTemplateService;

import lombok.RequiredArgsConstructor;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelTemplateServiceImpl implements ExcelTemplateService {

    private final TopicRepository topicRepository;

    // =========================================================
    // TOPIC TEMPLATE
    // =========================================================

    @Override
    public byte[] generateTopicImportTemplate() {

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            Sheet sheet =
                    workbook.createSheet("Topics");

            // =====================================================
            // HEADER
            // =====================================================

            Row header =
                    sheet.createRow(0);

            header.createCell(0)
                    .setCellValue("Name");

            header.createCell(1)
                    .setCellValue("Description");

            // =====================================================
            // EXAMPLE
            // =====================================================

            Row example =
                    sheet.createRow(1);

            example.createCell(0)
                    .setCellValue("Application Security");

            example.createCell(1)
                    .setCellValue(
                            "Application security controls"
                    );

            // =====================================================
            // HEADER STYLE
            // =====================================================

            CellStyle headerStyle =
                    createHeaderStyle(workbook);

            header.getCell(0)
                    .setCellStyle(headerStyle);

            header.getCell(1)
                    .setCellStyle(headerStyle);

            // =====================================================
            // WIDTH
            // =====================================================

            sheet.setColumnWidth(
                    0,
                    35 * 256
            );

            sheet.setColumnWidth(
                    1,
                    60 * 256
            );

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate topic import template",
                    e
            );
        }
    }

    // =========================================================
    // QUESTION TEMPLATE
    // =========================================================

    @Override
    public byte[] generateQuestionImportTemplate() {

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            // =====================================================
            // QUESTIONS SHEET
            // =====================================================

            Sheet sheet =
                    workbook.createSheet("Questions");

            // =====================================================
            // HEADER
            // =====================================================

            Row header =
                    sheet.createRow(0);

            header.createCell(0)
                    .setCellValue("Question Text");

            header.createCell(1)
                    .setCellValue("Help Text");

            header.createCell(2)
                    .setCellValue("Question Type");

            header.createCell(3)
                    .setCellValue("Weight");

            header.createCell(4)
                    .setCellValue("Mandatory");

            header.createCell(5)
                    .setCellValue("Status");

            header.createCell(6)
                    .setCellValue("Topic");

            // =====================================================
            // HEADER STYLE
            // =====================================================

            CellStyle headerStyle =
                    createHeaderStyle(workbook);

            for (int i = 0; i <= 6; i++) {

                header.getCell(i)
                        .setCellStyle(headerStyle);
            }

            // =====================================================
            // EXAMPLE ROW
            // =====================================================

            Row example =
                    sheet.createRow(1);

            example.createCell(0)
                    .setCellValue(
                            "Does the organization have an information security policy?"
                    );

            example.createCell(1)
                    .setCellValue(
                            "Provide details of the security policy."
                    );

            example.createCell(2)
                    .setCellValue("YESNO");

            example.createCell(3)
                    .setCellValue(1);

            example.createCell(4)
                    .setCellValue("YES");

            example.createCell(5)
                    .setCellValue("DRAFT");

            if (!topicRepository.findAll().isEmpty()) {

                example.createCell(6)
                        .setCellValue(
                                topicRepository
                                        .findAll()
                                        .get(0)
                                        .getName()
                        );
            }

            // =====================================================
            // LIST SHEET
            // =====================================================

            Sheet listsSheet =
                    workbook.createSheet("Lists");

            // =====================================================
            // TOPICS
            // =====================================================

            Row listHeader =
                    listsSheet.createRow(0);

            listHeader.createCell(0)
                    .setCellValue("Topics");

            List<Topic> topics =
                    topicRepository.findAll();

            for (int i = 0;
                 i < topics.size();
                 i++) {

                Row row =
                        listsSheet.createRow(i + 1);

                row.createCell(0)
                        .setCellValue(
                                topics.get(i).getName()
                        );
            }

            // =====================================================
            // QUESTION TYPES
            // =====================================================

            listHeader.createCell(1)
                    .setCellValue("QuestionTypes");

            String[] questionTypes = {
                    "TEXT",
                    "PARAGRAPH",
                    "YESNO",
                    "DROPDOWN",
                    "CHECKBOX",
                    "NUMBER",
                    "DATE",
                    "FILE"
            };

            for (int i = 0;
                 i < questionTypes.length;
                 i++) {

                listsSheet
                        .getRow(i + 1)
                        .createCell(1)
                        .setCellValue(
                                questionTypes[i]
                        );
            }

            // =====================================================
            // MANDATORY
            // =====================================================

            listHeader.createCell(2)
                    .setCellValue("Mandatory");

            listsSheet
                    .getRow(1)
                    .createCell(2)
                    .setCellValue("YES");

            listsSheet
                    .getRow(2)
                    .createCell(2)
                    .setCellValue("NO");

            // =====================================================
            // STATUS
            // =====================================================

            listHeader.createCell(3)
                    .setCellValue("Status");

            String[] statuses = {
                    "DRAFT",
                    "PUBLISHED",
                    "ARCHIVED"
            };

            for (int i = 0;
                 i < statuses.length;
                 i++) {

                listsSheet
                        .getRow(i + 1)
                        .createCell(3)
                        .setCellValue(
                                statuses[i]
                        );
            }

            // =====================================================
            // DATA VALIDATION
            // =====================================================

            DataValidationHelper helper =
                    sheet.getDataValidationHelper();

            // =====================================================
            // TOPIC DROPDOWN
            // =====================================================

            if (!topics.isEmpty()) {

                String topicFormula =
                        "Lists!$A$2:$A$"
                                + (topics.size() + 1);

                DataValidationConstraint constraint =
                        helper.createFormulaListConstraint(
                                topicFormula
                        );

                CellRangeAddressList range =
                        new CellRangeAddressList(
                                1,
                                499,
                                6,
                                6
                        );

                DataValidation validation =
                        helper.createValidation(
                                constraint,
                                range
                        );

                validation.setSuppressDropDownArrow(false);
                validation.setShowErrorBox(true);

                sheet.addValidationData(
                        validation
                );
            }

            // =====================================================
            // QUESTION TYPE DROPDOWN
            // =====================================================

            String typeFormula =
                    "Lists!$B$2:$B$"
                            + (questionTypes.length + 1);

            DataValidationConstraint typeConstraint =
                    helper.createFormulaListConstraint(
                            typeFormula
                    );

            CellRangeAddressList typeRange =
                    new CellRangeAddressList(
                            1,
                            499,
                            2,
                            2
                    );

            DataValidation typeValidation =
                    helper.createValidation(
                            typeConstraint,
                            typeRange
                    );

            typeValidation.setSuppressDropDownArrow(false);
            typeValidation.setShowErrorBox(true);

            sheet.addValidationData(
                    typeValidation
            );

            // =====================================================
            // MANDATORY DROPDOWN
            // =====================================================

            DataValidationConstraint mandatoryConstraint =
                    helper.createFormulaListConstraint(
                            "Lists!$C$2:$C$3"
                    );

            CellRangeAddressList mandatoryRange =
                    new CellRangeAddressList(
                            1,
                            499,
                            4,
                            4
                    );

            DataValidation mandatoryValidation =
                    helper.createValidation(
                            mandatoryConstraint,
                            mandatoryRange
                    );

            mandatoryValidation.setSuppressDropDownArrow(false);
            mandatoryValidation.setShowErrorBox(true);

            sheet.addValidationData(
                    mandatoryValidation
            );

            // =====================================================
            // STATUS DROPDOWN
            // =====================================================

            DataValidationConstraint statusConstraint =
                    helper.createFormulaListConstraint(
                            "Lists!$D$2:$D$4"
                    );

            CellRangeAddressList statusRange =
                    new CellRangeAddressList(
                            1,
                            499,
                            5,
                            5
                    );

            DataValidation statusValidation =
                    helper.createValidation(
                            statusConstraint,
                            statusRange
                    );

            statusValidation.setSuppressDropDownArrow(false);
            statusValidation.setShowErrorBox(true);

            sheet.addValidationData(
                    statusValidation
            );

            // =====================================================
            // HIDE LIST SHEET
            // =====================================================

            workbook.setSheetHidden(
                    workbook.getSheetIndex(listsSheet),
                    true
            );

            // =====================================================
            // COLUMN WIDTH
            // =====================================================

            sheet.setColumnWidth(
                    0,
                    50 * 256
            );

            sheet.setColumnWidth(
                    1,
                    40 * 256
            );

            sheet.setColumnWidth(
                    2,
                    20 * 256
            );

            sheet.setColumnWidth(
                    3,
                    12 * 256
            );

            sheet.setColumnWidth(
                    4,
                    15 * 256
            );

            sheet.setColumnWidth(
                    5,
                    15 * 256
            );

            sheet.setColumnWidth(
                    6,
                    30 * 256
            );

            // =====================================================
            // WRITE
            // =====================================================

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate question import template",
                    e
            );
        }
    }

    // =========================================================
    // HEADER STYLE
    // =========================================================

    private CellStyle createHeaderStyle(
            Workbook workbook
    ) {

        CellStyle style =
                workbook.createCellStyle();

        Font font =
                workbook.createFont();

        font.setBold(true);

        style.setFont(font);

        return style;
    }

    // =========================================================
    // VALIDATE TEMPLATE
    // =========================================================

    @Override
    public void validateTemplate(
            MultipartFile file
    ) {

        if (file == null ||
                file.isEmpty()) {

            throw new RuntimeException(
                    "Excel file is empty"
            );
        }

        String fileName =
                file.getOriginalFilename();

        if (fileName == null ||
                !(
                        fileName
                                .toLowerCase()
                                .endsWith(".xlsx")
                                ||
                                fileName
                                        .toLowerCase()
                                        .endsWith(".xls")
                )) {

            throw new RuntimeException(
                    "Only Excel files (.xlsx or .xls) are allowed"
            );
        }
    }
}