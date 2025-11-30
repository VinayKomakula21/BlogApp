package com.blogpost.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.blogpost.app.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> getByUserId(Long userId);

    @EntityGraph(attributePaths = {"user", "likes", "comments"})
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"user", "likes", "comments"})
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "likes", "comments"})
    @Query("SELECT p FROM Post p WHERE LOWER(p.postTitle) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.postContent) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY p.createdAt DESC")
    Page<Post> searchPosts(@Param("query") String query, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "likes", "comments"})
    Optional<Post> findById(Long id);

    @EntityGraph(attributePaths = {"user", "likes", "comments", "tags"})
    @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t WHERE t.slug = :tagSlug ORDER BY p.createdAt DESC")
    Page<Post> findByTagSlug(@Param("tagSlug") String tagSlug, Pageable pageable);
}
