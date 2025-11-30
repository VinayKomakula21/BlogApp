package com.blogpost.app.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String userName;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String role;
    private LocalDateTime createdAt;
    private int postsCount;
    private int commentsCount;
    private int likesCount;
}
