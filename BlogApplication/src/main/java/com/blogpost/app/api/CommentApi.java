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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blogpost.app.dto.CommentRequest;
import com.blogpost.app.dto.CommentResponse;
import com.blogpost.app.service.CommentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/Comments")
public class CommentApi {
    
    @Autowired
    private CommentService commentService;
    
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
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId,
            @RequestParam String username) {
        try {
            boolean deleted = commentService.deleteComment(commentId, username);
            if (deleted) {
                return ResponseEntity.ok("Comment deleted successfully");
            } else {
                return ResponseEntity.badRequest().body("Failed to delete comment");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}