package com.falow.ai;

import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "falow.ai.provider", havingValue = "unavailable", matchIfMissing = true)
public class UnavailableAIProvider implements AIProvider {
    @Override
    public AIResponse complete(String systemPrompt, String userPrompt, Map<String, Object> context) {
        throw new IllegalStateException("No AI provider configured. Set AI_PROVIDER and its server-side credentials.");
    }
}
