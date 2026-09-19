package com.falow.xp;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;

class XPServiceTest {
    private final XPService service = new XPService();

    @Test
    void firstAttemptReceivesFullAwardWhenCorrect() {
        XPAward award = service.calculate(20, 1, true, 1.0);
        assertThat(award.getAmount()).isEqualTo(20);
        assertThat(award.getAntiFarmingMultiplier()).isEqualTo(1.0);
    }

    @Test
    void repeatedAttemptsDecayToDiscourageGrinding() {
        assertThat(service.calculate(20, 2, true, 1.0).getAmount()).isEqualTo(10);
        assertThat(service.calculate(20, 3, true, 1.0).getAmount()).isEqualTo(5);
        assertThat(service.calculate(20, 4, true, 1.0).getAmount()).isEqualTo(1);
    }

    @Test
    void anIncorrectAttemptStillRecordsSmallEffortSignal() {
        XPAward award = service.calculate(25, 1, false, 1.0);
        assertThat(award.getAmount()).isEqualTo(5);
        assertThat(award.getReason()).isEqualTo("attempted_needs_review");
    }
}
