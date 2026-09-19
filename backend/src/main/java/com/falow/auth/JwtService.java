package com.falow.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final AuthProperties properties;

    public JwtService(AuthProperties properties) {
        this.properties = properties;
    }

    public String issue(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(Date.from(Instant.now().plus(properties.getTokenHours(), ChronoUnit.HOURS)))
                .signWith(signingKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String username(String token) {
        return parse(token).getBody().getSubject();
    }

    public boolean isValid(String token, String expectedUsername) {
        try {
            Claims claims = parse(token).getBody();
            return expectedUsername.equals(claims.getSubject()) && claims.getExpiration().after(new Date());
        } catch (RuntimeException exception) {
            return false;
        }
    }

    private Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(signingKey()).build().parseClaimsJws(token);
    }

    private Key signingKey() {
        String secret = properties.getJwtSecret();
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("JWT_SECRET must contain at least 32 characters");
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
