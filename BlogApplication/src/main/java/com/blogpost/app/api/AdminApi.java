package com.blogpost.app.api;

import com.blogpost.app.annotation.RequiresAuth;
import com.blogpost.app.annotation.RequiresRole;
import com.blogpost.app.dto.ErrorResponse;
import com.blogpost.app.dto.UpdateRoleRequest;
import com.blogpost.app.dto.UserProfileResponse;
import com.blogpost.app.entity.Comment;
import com.blogpost.app.entity.Post;
import com.blogpost.app.entity.User;
import com.blogpost.app.entity.UserRole;
import com.blogpost.app.exception.ResourceNotFoundException;
import com.blogpost.app.repository.CommentRepository;
import com.blogpost.app.repository.LikeRepository;
import com.blogpost.app.repository.PostRepository;
import com.blogpost.app.repository.UserRepository;
import com.blogpost.app.security.UserContext;
import com.blogpost.app.service.CommentService;
import com.blogpost.app.service.PostService;
import com.blogpost.app.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminApi {

    private static final Logger logger = LoggerFactory.getLogger(AdminApi.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentService commentService;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserContext userContext;

    @GetMapping("/users")
    @RequiresAuth
    @RequiresRole(UserRole.ADMIN)
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = userRepository.findAll(pageable);

        Page<UserProfileResponse> response = users.map(user -> UserProfileResponse.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .postsCount(postRepository.getByUserId(user.getId()).size())
                .commentsCount(commentRepository.countByUserId(user.getId()).intValue())
                .likesCount(likeRepository.countByUserId(user.getId()).intValue())
                .build());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{id}")
    @RequiresAuth
    @RequiresRole(UserRole.ADMIN)
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            UserProfileResponse response = UserProfileResponse.builder()
                    .id(user.getId())
                    .userName(user.getUserName())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .avatarUrl(user.getAvatarUrl())
                    .role(user.getRole().name())
                    .createdAt(user.getCreatedAt())
                    .postsCount(postRepository.getByUserId(user.getId()).size())
                    .commentsCount(commentRepository.countByUserId(user.getId()).intValue())
                    .likesCount(likeRepository.countByUserId(user.getId()).intValue())
                    .build();

            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "User not found", 404));
        }
    }

    @PutMapping("/users/{id}/role")
    @RequiresAuth
    @RequiresRole(UserRole.ADMIN)
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request) {

        Long currentUserId = userContext.getCurrentUserId();
        if (id.equals(currentUserId)) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Bad Request", "Cannot change your own role", 400));
        }

        try {
            UserRole newRole;
            try {
                newRole = UserRole.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                List<String> validRoles = Arrays.stream(UserRole.values())
                        .map(Enum::name)
                        .toList();
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Bad Request",
                                "Invalid role. Valid roles: " + validRoles, 400));
            }

            User user = userService.getUserById(id);
            user.setRole(newRole);
            userRepository.save(user);

            logger.info("User {} role updated to {} by admin {}",
                    user.getUserName(), newRole, userContext.getCurrentUsername());

            return ResponseEntity.ok().body("{\"message\": \"User role updated successfully\", \"newRole\": \"" + newRole + "\"}");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "User not found", 404));
        }
    }

    @DeleteMapping("/users/{id}")
    @RequiresAuth
    @RequiresRole(UserRole.ADMIN)
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Long currentUserId = userContext.getCurrentUserId();
        if (id.equals(currentUserId)) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Bad Request", "Cannot delete your own account", 400));
        }

        try {
            User user = userService.getUserById(id);
            String username = user.getUserName();
            userService.deleteUserById(id);

            logger.info("User {} deleted by admin {}", username, userContext.getCurrentUsername());

            return ResponseEntity.ok().body("{\"message\": \"User deleted successfully\"}");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "User not found", 404));
        }
    }

    @DeleteMapping("/posts/{id}")
    @RequiresAuth
    @RequiresRole(UserRole.ADMIN)
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        if (post == null) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "Post not found", 404));
        }

        String postTitle = post.getPostTitle();
        String postAuthor = post.getUser().getUserName();
        postService.deletePostById(id);

        logger.info("Post '{}' by {} deleted by admin {}",
                postTitle, postAuthor, userContext.getCurrentUsername());

        return ResponseEntity.ok().body("{\"message\": \"Post deleted successfully\"}");
    }

    @DeleteMapping("/comments/{id}")
    @RequiresAuth
    @RequiresRole(UserRole.ADMIN)
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "Comment not found", 404));
        }

        String commentAuthor = comment.getUser().getUserName();
        commentRepository.deleteById(id);

        logger.info("Comment by {} deleted by admin {}",
                commentAuthor, userContext.getCurrentUsername());

        return ResponseEntity.ok().body("{\"message\": \"Comment deleted successfully\"}");
    }

    @GetMapping("/stats")
    @RequiresAuth
    @RequiresRole(UserRole.ADMIN)
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();
        long totalComments = commentRepository.count();
        long totalLikes = likeRepository.count();

        return ResponseEntity.ok().body(String.format(
                "{\"totalUsers\": %d, \"totalPosts\": %d, \"totalComments\": %d, \"totalLikes\": %d}",
                totalUsers, totalPosts, totalComments, totalLikes));
    }
}
