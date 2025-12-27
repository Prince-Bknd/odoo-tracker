package com.project.tracker.dto;

import java.time.LocalDateTime;

public class TokenValidationDTO {
    
    private Long userId;
    private String username;
    private String email;
    private String role;
    private boolean isValid;
    private String message;
    private LocalDateTime validatedAt;
    private LocalDateTime tokenExpiration;
    
    public TokenValidationDTO() {}
    
    public TokenValidationDTO(Long userId, String username, String email, String role, 
                             boolean isValid, String message, LocalDateTime validatedAt, 
                             LocalDateTime tokenExpiration) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.isValid = isValid;
        this.message = message;
        this.validatedAt = validatedAt;
        this.tokenExpiration = tokenExpiration;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isValid() {
        return isValid;
    }

    public void setValid(boolean valid) {
        isValid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getValidatedAt() {
        return validatedAt;
    }

    public void setValidatedAt(LocalDateTime validatedAt) {
        this.validatedAt = validatedAt;
    }

    public LocalDateTime getTokenExpiration() {
        return tokenExpiration;
    }

    public void setTokenExpiration(LocalDateTime tokenExpiration) {
        this.tokenExpiration = tokenExpiration;
    }
}
