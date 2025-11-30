package com.blogpost.app.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogpost.app.annotation.RequiresAuth;
import com.blogpost.app.dto.CommentRequest;
import com.blogpost.app.dto.CommentResponse;
import com.blogpost.app.dto.ErrorResponse;
import com.blogpost.app.security.UserContext;
import com.blogpost.app.service.CommentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/Comments")
public class CommentApi {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserContext userContext;
    
    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId, 
            @Valid @RequestBody CommentRequest commentRequest) {
        try {
            CommentResponse response = commentService.addComment(postId, commentRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        try {
            List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{commentId}")
    @RequiresAuth
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            Long userId = userContext.getCurrentUserId();
            boolean isAdmin = userContext.isAdmin();

            boolean deleted = commentService.deleteComment(commentId, userId, isAdmin);
            if (deleted) {
                return ResponseEntity.ok("{\"message\": \"Comment deleted successfully\"}");
            } else {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Bad Request", "Failed to delete comment", 400));
            }
        } catch (SecurityException e) {
            return ResponseEntity.status(403)
                    .body(new ErrorResponse("Forbidden", e.getMessage(), 403));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", e.getMessage(), 404));
        }
    }
}