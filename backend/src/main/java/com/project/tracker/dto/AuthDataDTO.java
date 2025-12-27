package com.project.tracker.dto;

public class AuthDataDTO {
    private Long id;
    private String username;
    private String role;
    private String email;
    private String accessToken;
    private String refreshToken;
    private String tokenExpiration;
    private String createdAt;
    
    public AuthDataDTO() {}
    
    public AuthDataDTO(Long id, String username, String role, String email, 
                      String accessToken, String refreshToken, String tokenExpiration, String createdAt) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.email = email;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenExpiration = tokenExpiration;
        this.createdAt = createdAt;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    public String getTokenExpiration() {
        return tokenExpiration;
    }
    
    public void setTokenExpiration(String tokenExpiration) {
        this.tokenExpiration = tokenExpiration;
    }
    
    public String getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
