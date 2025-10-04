package com.blogpost.app.service;

import com.blogpost.app.entity.User;
import com.blogpost.app.repository.UserRepository;
import com.blogpost.app.security.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {

    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // In-memory blacklist for invalidated tokens (in production, use Redis)
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    @Transactional
    public Map<String, String> generateTokens(User user) {
        String accessToken = jwtUtils.generateAccessToken(user);
        String refreshToken = jwtUtils.generateRefreshToken(user);

        // Store refresh token in database
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("tokenType", "Bearer");

        return tokens;
    }

    @Transactional
    public Map<String, String> refreshTokens(String refreshToken, User user) {
        if (!jwtUtils.validateRefreshToken(refreshToken, user)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Check if the refresh token matches the one in database
        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new RuntimeException("Refresh token mismatch");
        }

        // Generate new tokens
        String newAccessToken = jwtUtils.generateAccessToken(user);
        String newRefreshToken = jwtUtils.generateRefreshToken(user);

        // Update refresh token in database (token rotation)
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        // Blacklist the old refresh token
        blacklistToken(refreshToken);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", newRefreshToken);
        tokens.put("tokenType", "Bearer");

        return tokens;
    }

    @Transactional
    public void revokeUserTokens(User user) {
        // Increment token version to invalidate all existing tokens
        user.setTokenVersion(user.getTokenVersion() + 1);
        user.setRefreshToken(null);
        userRepository.save(user);

        logger.info("All tokens revoked for user: {}", user.getUserName());
    }

    @Transactional
    public void logout(User user, String accessToken) {
        // Clear refresh token from database
        user.setRefreshToken(null);
        userRepository.save(user);

        // Blacklist the access token
        if (accessToken != null) {
            blacklistToken(accessToken);
        }

        logger.info("User {} logged out successfully", user.getUserName());
    }

    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    // Clean up expired tokens from blacklist every hour
    @Scheduled(fixedDelay = 3600000) // 1 hour
    public void cleanupBlacklist() {
        blacklistedTokens.removeIf(token -> {
            try {
                return jwtUtils.isTokenExpired(token);
            } catch (Exception e) {
                return true; // Remove invalid tokens
            }
        });
        logger.debug("Blacklist cleanup completed. Current size: {}", blacklistedTokens.size());
    }

    @Transactional
    public void invalidateAllUserSessions(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            revokeUserTokens(user);
        }
    }
}