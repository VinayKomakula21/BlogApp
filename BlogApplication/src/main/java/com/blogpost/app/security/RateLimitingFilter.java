package com.blogpost.app.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitingFilter.class);

    private static final int LOGIN_LIMIT_PER_MINUTE = 5;
    private static final int REGISTER_LIMIT_PER_HOUR = 3;
    private static final int GENERAL_LIMIT_PER_MINUTE = 100;

    private final ConcurrentHashMap<String, RateLimitEntry> loginAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, RateLimitEntry> registerAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, RateLimitEntry> generalRequests = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String clientIp = getClientIp(httpRequest);
        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        if (path.endsWith("/auth/login") && "POST".equalsIgnoreCase(method)) {
            if (!checkRateLimit(loginAttempts, clientIp, LOGIN_LIMIT_PER_MINUTE, 60000)) {
                logger.warn("Rate limit exceeded for login from IP: {}", clientIp);
                sendRateLimitResponse(httpResponse, "Too many login attempts. Please try again in a minute.");
                return;
            }
        }

        if (path.endsWith("/auth/register") && "POST".equalsIgnoreCase(method)) {
            if (!checkRateLimit(registerAttempts, clientIp, REGISTER_LIMIT_PER_HOUR, 3600000)) {
                logger.warn("Rate limit exceeded for registration from IP: {}", clientIp);
                sendRateLimitResponse(httpResponse, "Too many registration attempts. Please try again later.");
                return;
            }
        }

        if (!checkRateLimit(generalRequests, clientIp, GENERAL_LIMIT_PER_MINUTE, 60000)) {
            logger.warn("General rate limit exceeded for IP: {}", clientIp);
            sendRateLimitResponse(httpResponse, "Too many requests. Please slow down.");
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean checkRateLimit(ConcurrentHashMap<String, RateLimitEntry> map,
                                   String key, int limit, long windowMs) {
        long now = System.currentTimeMillis();

        RateLimitEntry entry = map.compute(key, (k, existing) -> {
            if (existing == null || (now - existing.windowStart) > windowMs) {
                return new RateLimitEntry(now, new AtomicInteger(1));
            }
            existing.count.incrementAndGet();
            return existing;
        });

        return entry.count.get() <= limit;
    }

    private void sendRateLimitResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(429);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\", \"status\": 429}");
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }

    @Scheduled(fixedRate = 300000)
    public void cleanupExpiredEntries() {
        long now = System.currentTimeMillis();

        loginAttempts.entrySet().removeIf(entry ->
            (now - entry.getValue().windowStart) > 60000);

        registerAttempts.entrySet().removeIf(entry ->
            (now - entry.getValue().windowStart) > 3600000);

        generalRequests.entrySet().removeIf(entry ->
            (now - entry.getValue().windowStart) > 60000);

        logger.debug("Cleaned up rate limit entries");
    }

    private static class RateLimitEntry {
        final long windowStart;
        final AtomicInteger count;

        RateLimitEntry(long windowStart, AtomicInteger count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
