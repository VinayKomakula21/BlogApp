package com.blogpost.app.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import com.blogpost.app.annotation.PublicEndpoint;
import com.blogpost.app.annotation.RequiresAuth;
import com.blogpost.app.dto.CommentRequest;
import com.blogpost.app.dto.CommentResponse;
import com.blogpost.app.dto.ErrorResponse;
import com.blogpost.app.dto.LikeRequest;
import com.blogpost.app.dto.LikeResponse;
import com.blogpost.app.dto.PostResponse;
import com.blogpost.app.entity.Post;
import com.blogpost.app.security.UserContext;
import com.blogpost.app.service.CommentService;
import com.blogpost.app.service.LikeService;
import com.blogpost.app.service.PostService;
import com.blogpost.app.service.UserService;

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

    @Autowired
    private UserContext userContext;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    @RequiresAuth
    public ResponseEntity<PostResponse> createPost(@RequestBody Post post) {
        if (post == null) {
            return ResponseEntity.badRequest().build();
        }

        // Set the current user as the post author
        Long currentUserId = userContext.getCurrentUserId();
        post.setUser(userService.getUserById(currentUserId));

        Post created = postService.createPost(post);
        PostResponse response = postService.mapToPostResponse(created, userContext.getCurrentUsername());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    @PublicEndpoint
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
    @PublicEndpoint
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostResponse> posts;
        if (tag != null && !tag.trim().isEmpty()) {
            posts = postService.getPostsByTag(tag.trim(), page, size, username);
        } else {
            posts = postService.getAllPostsPaginated(page, size, username);
        }
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    @PublicEndpoint
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam String q,
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Page<PostResponse> posts = postService.searchPosts(q.trim(), page, size, username);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/user/{id}")
    @PublicEndpoint
    public ResponseEntity<Page<PostResponse>> getAllPostsByUserId(
            @PathVariable Long id,
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostResponse> posts = postService.getPostsByUserIdPaginated(id, page, size, username);
        return ResponseEntity.ok(posts);
    }
    
    @PutMapping("/{id}")
    @RequiresAuth
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestBody Post updatedPost,
            @RequestParam(required = false) String username) {

        Long currentUserId = userContext.getCurrentUserId();
        boolean isAdmin = userContext.isAdmin();

        if (!postService.isOwner(id, currentUserId) && !isAdmin) {
            return ResponseEntity.status(403)
                    .body(new ErrorResponse("Forbidden", "You are not authorized to update this post", 403));
        }

        Post post = postService.updatePost(id, updatedPost);

        if (post == null) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "Post not found", 404));
        }

        PostResponse response = postService.mapToPostResponse(post, username);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @RequiresAuth
    public ResponseEntity<?> deletePostById(@PathVariable Long id) {
        Long currentUserId = userContext.getCurrentUserId();
        boolean isAdmin = userContext.isAdmin();

        if (!postService.isOwner(id, currentUserId) && !isAdmin) {
            return ResponseEntity.status(403)
                    .body(new ErrorResponse("Forbidden", "You are not authorized to delete this post", 403));
        }

        Post post = postService.getPostById(id);
        if (post == null) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse("Not Found", "Post not found", 404));
        }

        postService.deletePostById(id);
        return ResponseEntity.ok("Post deleted successfully.");
    }
    
    // Like
    @PostMapping("/{postId}/like")
    @RequiresAuth
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
    @PublicEndpoint
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
    @RequiresAuth
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
    @PublicEndpoint
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        try {
            List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}