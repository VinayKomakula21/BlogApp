package com.blogpost.app.security;

import com.blogpost.app.entity.User;
import com.blogpost.app.service.TokenService;
import com.blogpost.app.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @Autowired
    private UserContext userContext;

    @Autowired
    private TokenService tokenService;

    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/api/Posts",
        "/api/Posts/\\d+",
        "/api/Posts/user/\\d+"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        String method = request.getMethod();

        // Allow OPTIONS requests for CORS
        if ("OPTIONS".equals(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Allow public endpoints without authentication
        if (isPublicEndpoint(requestPath, method)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = extractTokenFromRequest(request);

            // Check if token is blacklisted
            if (jwt != null && tokenService.isTokenBlacklisted(jwt)) {
                logger.debug("Token is blacklisted for path: {}", requestPath);
                if (!isPublicEndpoint(requestPath, method)) {
                    sendUnauthorizedResponse(response, "Token has been invalidated");
                    return;
                }
            }

            if (jwt != null && jwtUtils.validateToken(jwt) && !tokenService.isTokenBlacklisted(jwt)) {
                String username = jwtUtils.extractUsername(jwt);
                Long userId = jwtUtils.extractUserId(jwt);
                String role = jwtUtils.extractRole(jwt);

                User user = userService.getUserById(userId);

                if (user != null && username.equals(user.getUserName())) {
                    AuthenticatedUser authenticatedUser = new AuthenticatedUser();
                    authenticatedUser.setUserId(userId);
                    authenticatedUser.setUsername(username);
                    authenticatedUser.setFirstName(user.getFirstName());
                    authenticatedUser.setLastName(user.getLastName());
                    authenticatedUser.setRole(role != null ? role : "USER");

                    userContext.setCurrentUser(authenticatedUser);
                    logger.debug("User {} authenticated successfully for path: {}", username, requestPath);

                    // Continue with the filter chain WITH the user context set
                    try {
                        filterChain.doFilter(request, response);
                    } finally {
                        // Clear user context after request processing
                        userContext.clear();
                    }
                    return;
                } else {
                    logger.warn("User validation failed for token");
                    // Don't send error for public endpoints, just continue without auth
                    if (!isPublicEndpoint(requestPath, method)) {
                        sendUnauthorizedResponse(response, "Invalid user");
                        return;
                    }
                }
            } else if (jwt != null) {
                logger.warn("Invalid JWT token for path: {}", requestPath);
                // Don't send error for public endpoints, just continue without auth
                if (!isPublicEndpoint(requestPath, method)) {
                    sendUnauthorizedResponse(response, "Invalid or expired token");
                    return;
                }
            } else {
                // No token provided
                if (!isPublicEndpoint(requestPath, method)) {
                    logger.debug("No JWT token for protected endpoint: {}", requestPath);
                    // Let it continue to the controller where @RequiresAuth will handle it
                }
            }

        } catch (Exception e) {
            logger.error("Error processing JWT authentication: {}", e.getMessage());
            // Don't block the request, let the annotation handle it
        }

        // Continue with the request
        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private boolean isPublicEndpoint(String requestPath, String method) {
        // Auth endpoints are public except logout and verify
        if (requestPath.startsWith("/api/auth/")) {
            // Logout and verify require authentication
            if (requestPath.equals("/api/auth/logout") || requestPath.equals("/api/auth/verify")) {
                return false;
            }
            return true;
        }

        // GET requests for posts are public (viewing)
        if ("GET".equals(method)) {
            if (requestPath.equals("/api/Posts") ||
                requestPath.matches("/api/Posts/\\d+") ||
                requestPath.matches("/api/Posts/user/\\d+") ||
                requestPath.matches("/api/Posts/\\d+/comments") ||
                requestPath.matches("/api/Posts/\\d+/likes")) {
                return true;
            }
        }

        // All other endpoints require authentication
        return false;
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
        response.getWriter().flush();
    }
}