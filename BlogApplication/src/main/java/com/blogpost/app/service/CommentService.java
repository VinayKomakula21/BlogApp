package com.blogpost.app.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blogpost.app.dto.CommentRequest;
import com.blogpost.app.dto.CommentResponse;
import com.blogpost.app.entity.Comment;
import com.blogpost.app.entity.Post;
import com.blogpost.app.entity.User;
import com.blogpost.app.repository.CommentRepository;
import com.blogpost.app.repository.PostRepository;
import com.blogpost.app.repository.UserRepository;

@Service
@Transactional
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public CommentResponse addComment(Long postId, CommentRequest commentRequest) {
        // Find post and user
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.getByUserName(commentRequest.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Create comment
        Comment comment = Comment.builder()
                .content(commentRequest.getContent())
                .post(post)
                .user(user)
                .build();
        
        Comment savedComment = commentRepository.save(comment);
        
        return mapToCommentResponse(savedComment);
    }
    
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        return comments.stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }
    
    public boolean deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Check if the user owns the comment
        if (!comment.getUser().getUserName().equals(username)) {
            throw new RuntimeException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
        return true;
    }
    
    public Long getCommentCountByPostId(Long postId) {
        return commentRepository.countByPostId(postId);
    }
    
    private CommentResponse mapToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .user(CommentResponse.UserResponse.builder()
                        .id(comment.getUser().getId())
                        .userName(comment.getUser().getUserName())
                        .firstName(comment.getUser().getFirstName())
                        .lastName(comment.getUser().getLastName())
                        .avatarUrl(comment.getUser().getAvatarUrl())
                        .build())
                .build();
    }
}