package com.falow.ai;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class StudentContextSelector {
    public Map<String, Object> select(StudentContextInput input) {
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("studentCefr", input.getStudentCefr());
        context.put("objective", input.getObjective());
        context.put("skills", input.getSkills());
        context.put("recurringErrors", input.getErrors().stream()
                .sorted(Comparator.comparingInt(StudentError::getUnresolvedSignals).reversed())
                .limit(5)
                .map(StudentError::getTitle)
                .collect(Collectors.toList()));
        context.put("recentTopic", input.getRecentTopic());
        return context;
    }

    public static class StudentContextInput {
        private String studentCefr;
        private String objective;
        private Map<String, String> skills = new LinkedHashMap<>();
        private List<StudentError> errors = new ArrayList<>();
        private String recentTopic;

        public String getStudentCefr() { return studentCefr; }
        public void setStudentCefr(String studentCefr) { this.studentCefr = studentCefr; }
        public String getObjective() { return objective; }
        public void setObjective(String objective) { this.objective = objective; }
        public Map<String, String> getSkills() { return skills; }
        public void setSkills(Map<String, String> skills) { this.skills = skills; }
        public List<StudentError> getErrors() { return errors; }
        public void setErrors(List<StudentError> errors) { this.errors = errors; }
        public String getRecentTopic() { return recentTopic; }
        public void setRecentTopic(String recentTopic) { this.recentTopic = recentTopic; }
    }

    public static class StudentError {
        private final String title;
        private final int unresolvedSignals;
        public StudentError(String title, int unresolvedSignals) { this.title = title; this.unresolvedSignals = unresolvedSignals; }
        public String getTitle() { return title; }
        public int getUnresolvedSignals() { return unresolvedSignals; }
    }
}
