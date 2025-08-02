package com.blogpost.app.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blogpost.app.entity.Post;
import com.blogpost.app.entity.User;
import com.blogpost.app.repository.PostRepository;
import com.blogpost.app.repository.UserRepository;

@Service
public class PostService {

	@Autowired
	private PostRepository postRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	public Post createPost(Post post){
		User user = userRepository.findById(post.getUser().getId()).get();
		
		Post postUp = Post.builder()
				.postTitle(post.getPostTitle())
				.postContent(post.getPostContent())
				.user(user)
				.createdAt(System.currentTimeMillis())
				.updatedAt(System.currentTimeMillis())
				.commentsCount((long) 0)
				.likesCount((long) 0)
				.build();
		
		return postRepository.save(postUp);
	}
	
	public Post getPostById(Long id) {
		return postRepository.findById(id).orElse(null);
	}
	
	public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
	
	public List<Post> getPostsByUserId(Long id) {
		return postRepository.getByUserId(id);
	}
	
	public boolean deletePostById(Long id) {
		postRepository.deleteById(id);
		return true;
	}
	
	public Post updatePost(Long id, Post updatedPost) {
		Post existing = postRepository.findById(id).get();
		
		if(updatedPost.getPostTitle() != existing.getPostTitle()) {
			existing.setPostTitle(updatedPost.getPostTitle());
		}
		if(updatedPost.getPostContent() != existing.getPostContent()) {
			existing.setPostContent(updatedPost.getPostContent());
		}
		return postRepository.save(existing);
	}
	
}
