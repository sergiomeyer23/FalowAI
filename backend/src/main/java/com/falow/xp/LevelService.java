package com.falow.xp;

import org.springframework.stereotype.Service;

@Service
public class LevelService {
    private static final int XP_PER_LEVEL = 300;

    public int levelForXp(int xp) {
        return Math.max(1, xp / XP_PER_LEVEL + 1);
    }

    public int xpIntoLevel(int xp) {
        return Math.floorMod(xp, XP_PER_LEVEL);
    }

    public int xpToNextLevel(int xp) {
        return XP_PER_LEVEL - xpIntoLevel(xp);
    }
}
