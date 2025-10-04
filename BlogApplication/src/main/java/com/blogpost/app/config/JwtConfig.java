package com.blogpost.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret:ThisIsAVeryLongSecretKeyForJWTTokenGenerationAndValidation2024}")
    private String jwtSecret;

    @Value("${jwt.access.expiration:900000}") // 15 minutes in milliseconds
    private Long accessTokenExpiration;

    @Value("${jwt.refresh.expiration:604800000}") // 7 days in milliseconds
    private Long refreshTokenExpiration;

    @Value("${jwt.issuer:BlogApplication}")
    private String issuer;

    public String getJwtSecret() {
        return jwtSecret;
    }

    public Long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    public Long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }

    public String getIssuer() {
        return issuer;
    }
}