package com.blogpost.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.blogpost.app.entity.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findBySlug(String slug);

    Optional<Tag> findByName(String name);

    List<Tag> findByNameIn(List<String> names);

    @Query("SELECT t FROM Tag t LEFT JOIN FETCH t.posts ORDER BY t.name")
    List<Tag> findAllWithPostCount();

    boolean existsBySlug(String slug);

    boolean existsByName(String name);
}
