package com.blogpost.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blogpost.app.entity.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long>{
	Like getByPostIdAndUserId(Long postId,Long userId);

}
