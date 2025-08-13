package com.blogpost.app.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogpost.app.dto.LikeRequest;
import com.blogpost.app.dto.LikeResponse;
import com.blogpost.app.service.LikeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/Likes")
public class LikeApi {
    
    @Autowired
    private LikeService likeService;
    
    @PostMapping("/post/{postId}/toggle")
    public ResponseEntity<LikeResponse> toggleLike(
            @PathVariable Long postId, 
            @Valid @RequestBody LikeRequest likeRequest) {
        try {
            LikeResponse response = likeService.toggleLike(postId, likeRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<LikeResponse> getLikesForPost(@PathVariable Long postId) {
        try {
            LikeResponse response = likeService.getLikesForPost(postId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}