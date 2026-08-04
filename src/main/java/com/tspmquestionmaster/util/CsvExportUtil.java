package com.tspmquestionmaster.util;

import com.tspmquestionmaster.entity.Question;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.List;

public class CsvExportUtil {

    private CsvExportUtil() {
    }

    public static ByteArrayInputStream exportQuestions(List<Question> questions) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        writer.println("Code,Question,Topic,Type,Weight,Mandatory,Status");

        for (Question question : questions) {

            writer.printf(
                    "\"%s\",\"%s\",\"%s\",\"%s\",%d,%s,%s%n",
                    question.getCode(),
                    question.getQuestionText().replace("\"", "\"\""),
                    question.getTopic().getName(),
                    question.getQuestionType(),
                    question.getWeight(),
                    question.getMandatory(),
                    question.getStatus()
            );
        }

        writer.flush();

        return new ByteArrayInputStream(out.toByteArray());
    }

}