package com.falow.api;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {
    @GetMapping
    public Map<String, Object> health() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "ok");
        response.put("service", "falow-backend");
        response.put("timestamp", Instant.now().toString());
        return response;
    }
}
