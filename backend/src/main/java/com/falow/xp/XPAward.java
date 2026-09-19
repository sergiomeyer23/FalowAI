package com.falow.xp;

public class XPAward {
    private final int amount;
    private final int attemptNumber;
    private final double antiFarmingMultiplier;
    private final String reason;

    public XPAward(int amount, int attemptNumber, double antiFarmingMultiplier, String reason) {
        this.amount = amount;
        this.attemptNumber = attemptNumber;
        this.antiFarmingMultiplier = antiFarmingMultiplier;
        this.reason = reason;
    }

    public int getAmount() { return amount; }
    public int getAttemptNumber() { return attemptNumber; }
    public double getAntiFarmingMultiplier() { return antiFarmingMultiplier; }
    public String getReason() { return reason; }
}
