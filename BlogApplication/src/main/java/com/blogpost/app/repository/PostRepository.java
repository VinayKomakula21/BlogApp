package com.blogpost.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blogpost.app.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>{
	List<Post> getByUserId(Long userId);
}
