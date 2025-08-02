package com.blogpost.app.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogpost.app.entity.Post;
import com.blogpost.app.service.PostService;


@RestController
@RequestMapping("/Posts")
public class PostApi {
	
	@Autowired
	private PostService postService;
	
	@PostMapping("/create")
	public ResponseEntity<Post> createPost(@RequestBody Post post){
		
		if(post == null) {
			return ResponseEntity.badRequest().build();
		}
		
		Post created = postService.createPost(post);
		return ResponseEntity.ok(created);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Post> getPostById(@PathVariable Long id){
		Post post = postService.getPostById(id);
		
		if(null == post) {
			return ResponseEntity.badRequest().body(null);
		}
		
		return ResponseEntity.ok(post);
	}
	
	@GetMapping
	public ResponseEntity<List<Post>> getAllPosts() {
		List<Post> posts = postService.getAllPosts();
		
		return ResponseEntity.ok(posts);
		
	}
	
	@GetMapping("/user/{id}")
	public ResponseEntity<List<Post>> getAllPostsByUserId(@PathVariable Long id) {
		List<Post> posts = postService.getPostsByUserId(id);
		
		return ResponseEntity.ok(posts);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post updatedPost) {
		Post post = postService.updatePost(id, updatedPost);
		
		if(null == post) {
			return ResponseEntity.badRequest().body(null);
		}
		return ResponseEntity.ok(post);
	}
	
	@DeleteMapping("/{id}")
    public ResponseEntity<String> deletePostById(@PathVariable Long id) {
        postService.deletePostById(id);
        
        return ResponseEntity.ok("Post deleted successfully.");
    }
}
