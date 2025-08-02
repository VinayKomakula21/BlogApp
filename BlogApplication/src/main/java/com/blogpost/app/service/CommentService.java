package com.blogpost.app.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blogpost.app.entity.Comment;
import com.blogpost.app.entity.Post;
import com.blogpost.app.entity.User;
import com.blogpost.app.repository.CommentRepository;
import com.blogpost.app.repository.PostRepository;
import com.blogpost.app.repository.UserRepository;

@Service
public class CommentService {
	@Autowired
	private CommentRepository commentRepository;
	@Autowired
    private PostRepository postRepository;
	@Autowired
    private UserRepository userRepository;
	
	public Comment commentPost(Long postId, Long userId, Comment comment) {
		User user = userRepository.findById(userId).get();
		Post post = postRepository.findById(postId).get();
		
		Comment commentUp = Comment.builder()
				.user(user)
				.post(Collections.singletonList(post))
				.commentContent(comment.getCommentContent())
				.commentTitle(comment.getCommentTitle())
				.createdAt(System.currentTimeMillis())
				.build();
		
		post.setCommentsCount(post.getCommentsCount()+1);
		postRepository.save(post);
		return commentRepository.save(commentUp);
	}
	public boolean deleteComment(Long userId, Long postId) {
		Comment comment = commentRepository.getByPostIdAndUserId(postId, userId);
		
		commentRepository.delete(comment);
		return true;
	}
}
