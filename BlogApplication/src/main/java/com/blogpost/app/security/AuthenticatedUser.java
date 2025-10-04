package com.blogpost.app.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticatedUser {
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private String role;

    public String getFullName() {
        return firstName + " " + (lastName != null ? lastName : "");
    }
}