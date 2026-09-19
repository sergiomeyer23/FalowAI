package com.falow.recommendation;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.Arrays;
import org.junit.jupiter.api.Test;

class RecommendationEngineTest {
    private final RecommendationEngine engine = new RecommendationEngine();

    @Test
    void prioritizesSpeakingWhenItIsTheWeakestSkill() {
        RecommendationEngine.Recommendation recommendation = engine.recommend(
                Arrays.asList(
                        new RecommendationEngine.SkillSignal("reading", 82),
                        new RecommendationEngine.SkillSignal("speaking", 54)),
                Arrays.asList());
        assertThat(recommendation.getType()).isEqualTo("speaking");
    }

    @Test
    void prioritizesAnUnstableRecurringError() {
        RecommendationEngine.Recommendation recommendation = engine.recommend(
                Arrays.asList(new RecommendationEngine.SkillSignal("grammar", 70)),
                Arrays.asList(new RecommendationEngine.ErrorSignal("make vs do", 12, 4, "Needs review")));
        assertThat(recommendation.getType()).isEqualTo("memory");
        assertThat(recommendation.getRationale()).contains("make vs do");
    }
}
