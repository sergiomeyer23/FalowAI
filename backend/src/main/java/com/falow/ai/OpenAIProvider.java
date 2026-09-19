package com.falow.ai;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@ConditionalOnProperty(name = "falow.ai.provider", havingValue = "openai")
public class OpenAIProvider implements AIProvider {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String model;

    public OpenAIProvider(
            @Value("${falow.ai.openai-api-key}") String apiKey,
            @Value("${falow.ai.openai-model:gpt-4o-mini}") String model) {
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    @SuppressWarnings("unchecked")
    public AIResponse complete(String systemPrompt, String userPrompt, Map<String, Object> context) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OPENAI_API_KEY is required when AI_PROVIDER=openai");
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("temperature", 0.2);
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(message("system", systemPrompt));
        messages.add(message("user", userPrompt + "\n\nStudent context:\n" + context));
        body.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.openai.com/v1/chat/completions",
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                Map.class);
        Map<String, Object> payload = response.getBody();
        if (payload == null || !(payload.get("choices") instanceof List) || ((List<?>) payload.get("choices")).isEmpty()) {
            throw new IllegalStateException("AI provider returned no choices");
        }
        Object first = ((List<?>) payload.get("choices")).get(0);
        Object message = ((Map<String, Object>) first).get("message");
        String content = String.valueOf(((Map<String, Object>) message).get("content"));
        return new AIResponse(content, "openai");
    }

    private Map<String, String> message(String role, String content) {
        Map<String, String> message = new LinkedHashMap<>();
        message.put("role", role);
        message.put("content", content);
        return message;
    }
}
