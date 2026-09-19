package com.falow.xp;

import org.springframework.stereotype.Service;

@Service
public class XPService {
    public XPAward calculate(int baseXp, int attemptNumber, boolean correct, double difficulty) {
        if (baseXp < 0) {
            throw new IllegalArgumentException("baseXp cannot be negative");
        }
        if (attemptNumber < 1) {
            throw new IllegalArgumentException("attemptNumber must be at least 1");
        }
        if (difficulty <= 0 || difficulty > 2) {
            throw new IllegalArgumentException("difficulty must be greater than 0 and no more than 2");
        }

        double antiFarming = attemptNumber == 1 ? 1.0 : attemptNumber == 2 ? 0.5 : attemptNumber == 3 ? 0.25 : 0.05;
        double performance = correct ? 1.0 : 0.2;
        int amount = Math.max(1, (int) Math.round(baseXp * difficulty * performance * antiFarming));
        String reason = correct ? "completed_with_evidence" : "attempted_needs_review";
        return new XPAward(amount, attemptNumber, antiFarming, reason);
    }
}
