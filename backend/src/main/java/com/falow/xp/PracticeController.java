package com.falow.xp;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/practice")
public class PracticeController {
    private final XPService xpService;

    public PracticeController(XPService xpService) {
        this.xpService = xpService;
    }

    @PostMapping("/evaluate")
    public ResponseEntity<EvaluationResponse> evaluate(@Valid @RequestBody EvaluationRequest request) {
        String normalizedAnswer = normalize(request.getAnswer());
        boolean correct = request.getAcceptedAnswers().stream()
                .map(this::normalize)
                .anyMatch(normalizedAnswer::equals);
        XPAward award = xpService.calculate(request.getBaseXp(), request.getAttemptNumber(), correct, request.getDifficulty());
        return ResponseEntity.ok(new EvaluationResponse(correct, award));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT).replaceAll("[.!?,;:]+$", "").replaceAll("\\s+", " ");
    }

    public static class EvaluationRequest {
        @NotEmpty private String answer;
        @NotEmpty private List<String> acceptedAnswers;
        @Min(0) private int baseXp;
        @Min(1) private int attemptNumber;
        @DecimalMin("0.01") @DecimalMax("2.0") private double difficulty = 1.0;

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
        public List<String> getAcceptedAnswers() { return acceptedAnswers; }
        public void setAcceptedAnswers(List<String> acceptedAnswers) { this.acceptedAnswers = acceptedAnswers; }
        public int getBaseXp() { return baseXp; }
        public void setBaseXp(int baseXp) { this.baseXp = baseXp; }
        public int getAttemptNumber() { return attemptNumber; }
        public void setAttemptNumber(int attemptNumber) { this.attemptNumber = attemptNumber; }
        public double getDifficulty() { return difficulty; }
        public void setDifficulty(double difficulty) { this.difficulty = difficulty; }
    }

    public static class EvaluationResponse {
        private final boolean correct;
        private final XPAward award;

        public EvaluationResponse(boolean correct, XPAward award) { this.correct = correct; this.award = award; }
        public boolean isCorrect() { return correct; }
        public XPAward getAward() { return award; }
    }
}
