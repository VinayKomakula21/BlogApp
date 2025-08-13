package com.blogpost.app.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {
    private Long id;
    private String postTitle;
    private String postContent;
    private String image;
    private UserResponse user;
    private int likesCount;
    private int commentsCount;
    private boolean isLiked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserResponse {
        private Long id;
        private String userName;
        private String firstName;
        private String lastName;
        private String avatarUrl;
    }
}