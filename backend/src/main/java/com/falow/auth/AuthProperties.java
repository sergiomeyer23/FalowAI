package com.falow.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "falow.auth")
public class AuthProperties {
    private String username;
    private String passwordHash;
    private String jwtSecret;
    private long tokenHours = 12;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getJwtSecret() { return jwtSecret; }
    public void setJwtSecret(String jwtSecret) { this.jwtSecret = jwtSecret; }
    public long getTokenHours() { return tokenHours; }
    public void setTokenHours(long tokenHours) { this.tokenHours = tokenHours; }
}
