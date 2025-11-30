package com.blogpost.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.blogpost.app.entity.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    @Query("SELECT l FROM Like l WHERE l.post.id = :postId AND l.user.id = :userId")
    Optional<Like> findByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);
    
    @Query("SELECT l FROM Like l WHERE l.post.id = :postId")
    List<Like> findByPostId(@Param("postId") Long postId);
    
    @Query("SELECT COUNT(l) FROM Like l WHERE l.post.id = :postId")
    Long countByPostId(@Param("postId") Long postId);
    
    @Query("SELECT l.user.userName FROM Like l WHERE l.post.id = :postId")
    List<String> findUsernamesByPostId(@Param("postId") Long postId);
    
    void deleteByPostId(Long postId);

    boolean existsByPostIdAndUserId(Long postId, Long userId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}