package com.falow.api;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> badCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error("Invalid credentials"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> validation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst().map(error -> error.getField() + " is required")
                .orElse("Invalid request");
        return ResponseEntity.badRequest().body(error(message));
    }

    private Map<String, String> error(String message) {
        Map<String, String> response = new LinkedHashMap<>();
        response.put("error", message);
        return response;
    }
}
