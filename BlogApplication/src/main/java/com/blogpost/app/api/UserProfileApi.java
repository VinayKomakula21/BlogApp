package com.blogpost.app.api;

import com.blogpost.app.annotation.PublicEndpoint;
import com.blogpost.app.annotation.RequiresAuth;
import com.blogpost.app.dto.ChangePasswordRequest;
import com.blogpost.app.dto.ErrorResponse;
import com.blogpost.app.dto.UpdateProfileRequest;
import com.blogpost.app.dto.UserProfileResponse;
import com.blogpost.app.entity.User;
import com.blogpost.app.exception.ResourceNotFoundException;
import com.blogpost.app.repository.CommentRepository;
import com.blogpost.app.repository.LikeRepository;
import com.blogpost.app.repository.PostRepository;
import com.blogpost.app.security.UserContext;
import com.blogpost.app.service.UserService;
import com.blogpost.app.utils.PasswordHasher;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserProfileApi {

    @Autowired
    private UserService userService;

    @Autowired
    private UserContext userContext;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @GetMapping("/{id}")
    @PublicEndpoint
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            UserProfileResponse response = mapToProfileResponse(user);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "User not found", 404));
        }
    }

    @GetMapping("/me")
    @RequiresAuth
    public ResponseEntity<?> getCurrentUserProfile() {
        Long currentUserId = userContext.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(401)
                    .body(new ErrorResponse("Unauthorized", "Not authenticated", 401));
        }

        try {
            User user = userService.getUserById(currentUserId);
            UserProfileResponse response = mapToProfileResponse(user);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "User not found", 404));
        }
    }

    @PutMapping("/me")
    @RequiresAuth
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        Long currentUserId = userContext.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(401)
                    .body(new ErrorResponse("Unauthorized", "Not authenticated", 401));
        }

        try {
            User user = userService.getUserById(currentUserId);

            if (request.getFirstName() != null) {
                user.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                user.setLastName(request.getLastName());
            }
            if (request.getAvatarUrl() != null) {
                user.setAvatarUrl(request.getAvatarUrl());
            }

            User updated = userService.updateUser(currentUserId, user);
            UserProfileResponse response = mapToProfileResponse(updated);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "User not found", 404));
        }
    }

    @PutMapping("/me/password")
    @RequiresAuth
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Long currentUserId = userContext.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(401)
                    .body(new ErrorResponse("Unauthorized", "Not authenticated", 401));
        }

        try {
            User user = userService.getUserById(currentUserId);

            if (!PasswordHasher.verify(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(400)
                        .body(new ErrorResponse("Bad Request", "Current password is incorrect", 400));
            }

            if (request.getCurrentPassword().equals(request.getNewPassword())) {
                return ResponseEntity.status(400)
                        .body(new ErrorResponse("Bad Request", "New password must be different from current password", 400));
            }

            user.setPassword(PasswordHasher.hash(request.getNewPassword()));
            userService.updateUser(currentUserId, user);

            return ResponseEntity.ok().body("{\"message\": \"Password changed successfully\"}");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "User not found", 404));
        }
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        int postsCount = postRepository.getByUserId(user.getId()).size();
        Long commentsCount = commentRepository.countByUserId(user.getId());
        Long likesCount = likeRepository.countByUserId(user.getId());

        return UserProfileResponse.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .postsCount(postsCount)
                .commentsCount(commentsCount != null ? commentsCount.intValue() : 0)
                .likesCount(likesCount != null ? likesCount.intValue() : 0)
                .build();
    }
}
