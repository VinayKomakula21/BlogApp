package com.blogpost.app.security;

import org.springframework.stereotype.Component;

@Component
public class UserContext {

    private static final ThreadLocal<AuthenticatedUser> currentUser = new ThreadLocal<>();

    public AuthenticatedUser getCurrentUser() {
        return currentUser.get();
    }

    public void setCurrentUser(AuthenticatedUser user) {
        currentUser.set(user);
    }

    public void clear() {
        currentUser.remove();
    }

    public boolean isAuthenticated() {
        return currentUser.get() != null;
    }

    public Long getCurrentUserId() {
        AuthenticatedUser user = currentUser.get();
        return user != null ? user.getUserId() : null;
    }

    public String getCurrentUsername() {
        AuthenticatedUser user = currentUser.get();
        return user != null ? user.getUsername() : null;
    }

    public String getCurrentUserRole() {
        AuthenticatedUser user = currentUser.get();
        return user != null ? user.getRole() : null;
    }

    public boolean hasRole(String role) {
        AuthenticatedUser user = currentUser.get();
        return user != null && role != null && role.equals(user.getRole());
    }

    public boolean isAdmin() {
        return hasRole("ADMIN");
    }
}