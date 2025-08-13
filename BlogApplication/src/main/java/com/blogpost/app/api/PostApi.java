package com.blogpost.app.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blogpost.app.dto.CommentRequest;
import com.blogpost.app.dto.CommentResponse;
import com.blogpost.app.dto.LikeRequest;
import com.blogpost.app.dto.LikeResponse;
import com.blogpost.app.dto.PostResponse;
import com.blogpost.app.entity.Post;
import com.blogpost.app.service.CommentService;
import com.blogpost.app.service.LikeService;
import com.blogpost.app.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/Posts")
public class PostApi {
    
    @Autowired
    private PostService postService;
    
    @Autowired
    private LikeService likeService;
    
    @Autowired
    private CommentService commentService;
    
    @PostMapping("/create")
    public ResponseEntity<PostResponse> createPost(@RequestBody Post post) {
        if (post == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Post created = postService.createPost(post);
        PostResponse response = postService.mapToPostResponse(created, null);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(
            @PathVariable Long id,
            @RequestParam(required = false) String username) {
        Post post = postService.getPostById(id);
        
        if (post == null) {
            return ResponseEntity.badRequest().body(null);
        }
        
        PostResponse response = postService.mapToPostResponse(post, username);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(
            @RequestParam(required = false) String username) {
        List<PostResponse> posts = postService.getAllPostsWithUserContext(username);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/user/{id}")
    public ResponseEntity<List<PostResponse>> getAllPostsByUserId(
            @PathVariable Long id,
            @RequestParam(required = false) String username) {
        List<PostResponse> posts = postService.getPostsByUserIdWithContext(id, username);
        return ResponseEntity.ok(posts);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id, 
            @RequestBody Post updatedPost,
            @RequestParam(required = false) String username) {
        Post post = postService.updatePost(id, updatedPost);
        
        if (post == null) {
            return ResponseEntity.badRequest().body(null);
        }
        
        PostResponse response = postService.mapToPostResponse(post, username);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePostById(@PathVariable Long id) {
        postService.deletePostById(id);
        return ResponseEntity.ok("Post deleted successfully.");
    }
    
    // Like 
    @PostMapping("/{postId}/like")
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
    
    @GetMapping("/{postId}/likes")
    public ResponseEntity<LikeResponse> getLikes(@PathVariable Long postId) {
        try {
            LikeResponse response = likeService.getLikesForPost(postId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Comment 
    @PostMapping("/{postId}/comments")
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
    
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        try {
            List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}