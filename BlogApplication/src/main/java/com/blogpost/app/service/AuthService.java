package com.blogpost.app.service;

import com.blogpost.app.dto.*;
import com.blogpost.app.entity.User;
import com.blogpost.app.entity.UserRole;
import com.blogpost.app.security.JwtUtils;
import com.blogpost.app.security.UserContext;
import com.blogpost.app.utils.PasswordHasher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserService userService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserContext userContext;

    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        User user = userService.getUserByUserName(loginRequest.getUserName());

        if (user == null) {
            throw new RuntimeException("Invalid username or password");
        }

        if (!PasswordHasher.verify(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Generate tokens
        Map<String, String> tokens = tokenService.generateTokens(user);

        // Build response
        LoginResponse.UserDto userDto = LoginResponse.UserDto.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().toString())
                .build();

        return LoginResponse.builder()
                .accessToken(tokens.get("accessToken"))
                .refreshToken(tokens.get("refreshToken"))
                .tokenType(tokens.get("tokenType"))
                .user(userDto)
                .build();
    }

    @Transactional
    public LoginResponse register(RegisterRequest registerRequest) {
        // Check if username already exists
        User existingUser = userService.getUserByUserName(registerRequest.getUserName());
        if (existingUser != null) {
            throw new RuntimeException("Username already exists");
        }

        // Create new user
        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .password(PasswordHasher.hash(registerRequest.getPassword()))
                .userName(registerRequest.getUserName())
                .avatarUrl(registerRequest.getAvatarUrl())
                .role(UserRole.USER) // Default role
                .tokenVersion(0)
                .createdAt(System.currentTimeMillis())
                .updatedAt(System.currentTimeMillis())
                .build();

        User savedUser = userService.createUser(user);

        if (savedUser == null) {
            throw new RuntimeException("Failed to create user");
        }

        // Generate tokens
        Map<String, String> tokens = tokenService.generateTokens(savedUser);

        // Build response
        LoginResponse.UserDto userDto = LoginResponse.UserDto.builder()
                .id(savedUser.getId())
                .userName(savedUser.getUserName())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .avatarUrl(savedUser.getAvatarUrl())
                .role(savedUser.getRole().toString())
                .build();

        logger.info("New user registered: {}", savedUser.getUserName());

        return LoginResponse.builder()
                .accessToken(tokens.get("accessToken"))
                .refreshToken(tokens.get("refreshToken"))
                .tokenType(tokens.get("tokenType"))
                .user(userDto)
                .build();
    }

    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        // Extract username from refresh token
        String username = jwtUtils.extractUsername(refreshToken);
        User user = userService.getUserByUserName(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Refresh tokens
        Map<String, String> tokens = tokenService.refreshTokens(refreshToken, user);

        return TokenRefreshResponse.builder()
                .accessToken(tokens.get("accessToken"))
                .refreshToken(tokens.get("refreshToken"))
                .tokenType(tokens.get("tokenType"))
                .build();
    }

    @Transactional
    public void logout(String accessToken) {
        // Get current user from context
        Long userId = userContext.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }

        User user = userService.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Perform logout
        tokenService.logout(user, accessToken);
        logger.info("User {} logged out", user.getUserName());
    }
}
