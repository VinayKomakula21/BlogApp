package com.blogpost.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blogpost.app.dto.LikeRequest;
import com.blogpost.app.dto.LikeResponse;
import com.blogpost.app.entity.Like;
import com.blogpost.app.entity.Post;
import com.blogpost.app.entity.User;
import com.blogpost.app.repository.LikeRepository;
import com.blogpost.app.repository.PostRepository;
import com.blogpost.app.repository.UserRepository;

@Service
@Transactional
public class LikeService {
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public LikeResponse toggleLike(Long postId, LikeRequest likeRequest) {
        // Find post and user
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.getByUserName(likeRequest.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Check if like already exists
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, user.getId());
        
        boolean isLiked;
        if (existingLike.isPresent()) {
            // Unlike - remove the like
            likeRepository.delete(existingLike.get());
            isLiked = false;
        } else {
            // Like - add new like
            Like like = Like.builder()
                    .post(post)
                    .user(user)
                    .build();
            likeRepository.save(like);
            isLiked = true;
        }
        
        // Get updated counts and user list
        Long likesCount = likeRepository.countByPostId(postId);
        
        return LikeResponse.builder()
                .isLiked(isLiked)
                .likesCount(likesCount)
                .count(likesCount)
                .build();
    }
    
    public LikeResponse getLikesForPost(Long postId) {
        Long likesCount = likeRepository.countByPostId(postId);
        List<String> usernames = likeRepository.findUsernamesByPostId(postId);
        
        return LikeResponse.builder()
                .count(likesCount)
                .users(usernames)
                .likesCount(likesCount)
                .build();
    }
    
    public boolean isPostLikedByUser(Long postId, String username) {
        User user = userRepository.getByUserName(username);
        if (user == null) {
            return false;
        }
        
        return likeRepository.existsByPostIdAndUserId(postId, user.getId());
    }
    
    public Long getLikeCountByPostId(Long postId) {
        return likeRepository.countByPostId(postId);
    }
}