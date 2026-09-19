package com.falow.ai;

import java.util.Map;

public interface AIProvider {
    AIResponse complete(String systemPrompt, String userPrompt, Map<String, Object> context);

    class AIResponse {
        private final String content;
        private final String provider;

        public AIResponse(String content, String provider) {
            this.content = content;
            this.provider = provider;
        }

        public String getContent() { return content; }
        public String getProvider() { return provider; }
    }
}
