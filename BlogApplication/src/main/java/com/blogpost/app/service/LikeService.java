package com.blogpost.app.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blogpost.app.entity.Like;
import com.blogpost.app.entity.Post;
import com.blogpost.app.entity.User;
import com.blogpost.app.repository.LikeRepository;
import com.blogpost.app.repository.PostRepository;
import com.blogpost.app.repository.UserRepository;

@Service
public class LikeService {
	
	@Autowired
	private LikeRepository likeRepository;
	@Autowired
    private PostRepository postRepository;
	@Autowired
    private UserRepository userRepository;
	
	public Like likePost(Long userId, Long postId) {
		User user = userRepository.findById(userId).get();
		Post post = postRepository.findById(postId).get();
		
		Like like = Like.builder()
				.user(user)
				.post(Collections.singletonList(post))
				.createdAt(System.currentTimeMillis())
				.build();
		
		post.setLikesCount(post.getLikesCount()+1);
		postRepository.save(post);
		return likeRepository.save(like);
	}
	
	public boolean unlikePost(Long userId, Long postId) {
		Like like = likeRepository.getByPostIdAndUserId(postId, userId);
		
		likeRepository.delete(like);
		
		return true;
	}
}
