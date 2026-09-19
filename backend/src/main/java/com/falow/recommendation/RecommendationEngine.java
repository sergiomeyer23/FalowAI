package com.falow.recommendation;

import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RecommendationEngine {
    public Recommendation recommend(List<SkillSignal> skills, List<ErrorSignal> errors) {
        SkillSignal weakest = skills.stream().min(Comparator.comparingDouble(SkillSignal::getScore))
                .orElseThrow(() -> new IllegalArgumentException("At least one skill signal is required"));
        ErrorSignal priorityError = errors.stream()
                .filter(error -> !"Mastered".equalsIgnoreCase(error.getStatus()))
                .max(Comparator.comparingInt(error -> error.getOccurrences() - error.getCorrected()))
                .orElse(null);

        if (weakest.getKey().equals("speaking")) {
            return new Recommendation("speaking", "Explain one technical idea aloud", "Production is the next bottleneck; use a short professional explanation and review the transcript.");
        }
        if (priorityError != null && priorityError.getOccurrences() - priorityError.getCorrected() >= 3) {
            return new Recommendation("memory", "Retrieve the recurring pattern", "Return to " + priorityError.getTitle() + " in a new context before adding more theory.");
        }
        return new Recommendation(weakest.getKey(), "Raise the challenge carefully", "Your weakest current signal is " + weakest.getKey() + ". Keep the same skill, but increase complexity.");
    }

    public static class SkillSignal {
        private final String key;
        private final double score;
        public SkillSignal(String key, double score) { this.key = key; this.score = score; }
        public String getKey() { return key; }
        public double getScore() { return score; }
    }

    public static class ErrorSignal {
        private final String title;
        private final int occurrences;
        private final int corrected;
        private final String status;
        public ErrorSignal(String title, int occurrences, int corrected, String status) {
            this.title = title; this.occurrences = occurrences; this.corrected = corrected; this.status = status;
        }
        public String getTitle() { return title; }
        public int getOccurrences() { return occurrences; }
        public int getCorrected() { return corrected; }
        public String getStatus() { return status; }
    }

    public static class Recommendation {
        private final String type;
        private final String title;
        private final String rationale;
        public Recommendation(String type, String title, String rationale) { this.type = type; this.title = title; this.rationale = rationale; }
        public String getType() { return type; }
        public String getTitle() { return title; }
        public String getRationale() { return rationale; }
    }
}
