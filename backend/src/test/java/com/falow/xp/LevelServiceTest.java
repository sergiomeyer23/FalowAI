package com.falow.xp;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;

class LevelServiceTest {
    private final LevelService service = new LevelService();

    @Test
    void levelProgressIsIndependentFromCefr() {
        assertThat(service.levelForXp(0)).isEqualTo(1);
        assertThat(service.levelForXp(4820)).isEqualTo(17);
        assertThat(service.xpIntoLevel(4820)).isEqualTo(20);
        assertThat(service.xpToNextLevel(4820)).isEqualTo(280);
    }
}
