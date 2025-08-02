package com.blogpost.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blogpost.app.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
	Comment getByPostIdAndUserId(Long postId,Long userId);
}
