package com.blogpost.app.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blogpost.app.dto.PostResponse;
import com.blogpost.app.entity.Post;
import com.blogpost.app.entity.User;
import com.blogpost.app.repository.PostRepository;
import com.blogpost.app.repository.UserRepository;

@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LikeService likeService;
    
    @Autowired
    private CommentService commentService;
    
    public Post createPost(Post post) {
        User user = userRepository.getByUserName(post.getUser().getUserName());
        
        Post postUp = Post.builder()
                .postTitle(post.getPostTitle())
                .postContent(post.getPostContent())
                .image(post.getImage())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        return postRepository.save(postUp);
    }
    
    public Post getPostById(Long id) {
        return postRepository.findById(id).orElse(null);
    }
    
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    
    public List<PostResponse> getAllPostsWithUserContext(String username) {
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .map(post -> mapToPostResponse(post, username))
                .collect(Collectors.toList());
    }
    
    public List<Post> getPostsByUserId(Long id) {
        return postRepository.getByUserId(id);
    }
    
    public List<PostResponse> getPostsByUserIdWithContext(Long userId, String username) {
        List<Post> posts = postRepository.getByUserId(userId);
        return posts.stream()
                .map(post -> mapToPostResponse(post, username))
                .collect(Collectors.toList());
    }
    
    public boolean deletePostById(Long id) {
        postRepository.deleteById(id);
        return true;
    }
    
    public Post updatePost(Long id, Post updatedPost) {
        Post existing = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (updatedPost.getPostTitle() != null && 
            !updatedPost.getPostTitle().equals(existing.getPostTitle())) {
            existing.setPostTitle(updatedPost.getPostTitle());
        }
        
        if (updatedPost.getPostContent() != null && 
            !updatedPost.getPostContent().equals(existing.getPostContent())) {
            existing.setPostContent(updatedPost.getPostContent());
        }
        
        if (updatedPost.getImage() != null) {
            existing.setImage(updatedPost.getImage());
        }
        
        existing.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(existing);
    }
    
    public PostResponse mapToPostResponse(Post post, String currentUsername) {
        boolean isLiked = false;
        
        if (currentUsername != null) {
            isLiked = likeService.isPostLikedByUser(post.getId(), currentUsername);
        }
        
        return PostResponse.builder()
                .id(post.getId())
                .postTitle(post.getPostTitle())
                .postContent(post.getPostContent())
                .image(post.getImage())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .isLiked(isLiked)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .user(PostResponse.UserResponse.builder()
                        .id(post.getUser().getId())
                        .userName(post.getUser().getUserName())
                        .firstName(post.getUser().getFirstName())
                        .lastName(post.getUser().getLastName())
                        .avatarUrl(post.getUser().getAvatarUrl())
                        .build())
                .build();
    }
}