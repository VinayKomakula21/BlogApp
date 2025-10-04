package com.blogpost.app.security;

import com.blogpost.app.annotation.RequiresAuth;
import com.blogpost.app.annotation.RequiresRole;
import com.blogpost.app.entity.UserRole;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class AuthorizationAspect {

    private static final Logger logger = LoggerFactory.getLogger(AuthorizationAspect.class);

    @Autowired
    private UserContext userContext;

    @Before("@annotation(requiresAuth)")
    public void checkAuthentication(JoinPoint joinPoint, RequiresAuth requiresAuth) {
        if (!userContext.isAuthenticated()) {
            logger.warn("Unauthorized access attempt to method: {}", joinPoint.getSignature().getName());
            throw new SecurityException("Authentication required");
        }
        logger.debug("User {} authenticated for method: {}", userContext.getCurrentUsername(), joinPoint.getSignature().getName());
    }

    @Before("@annotation(requiresRole)")
    public void checkRole(JoinPoint joinPoint, RequiresRole requiresRole) {
        if (!userContext.isAuthenticated()) {
            logger.warn("Unauthorized access attempt to method: {}", joinPoint.getSignature().getName());
            throw new SecurityException("Authentication required");
        }

        UserRole[] allowedRoles = requiresRole.value();
        String currentUserRole = userContext.getCurrentUserRole();

        boolean hasRole = Arrays.stream(allowedRoles)
                .anyMatch(role -> role.toString().equals(currentUserRole));

        if (!hasRole) {
            logger.warn("User {} with role {} denied access to method: {}",
                    userContext.getCurrentUsername(), currentUserRole, joinPoint.getSignature().getName());
            throw new SecurityException("Insufficient permissions. Required roles: " + Arrays.toString(allowedRoles));
        }

        logger.debug("User {} with role {} authorized for method: {}",
                userContext.getCurrentUsername(), currentUserRole, joinPoint.getSignature().getName());
    }
}