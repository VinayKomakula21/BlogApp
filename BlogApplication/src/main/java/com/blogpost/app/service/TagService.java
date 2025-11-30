package com.blogpost.app.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blogpost.app.entity.Tag;
import com.blogpost.app.repository.TagRepository;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public List<Tag> getAllTags() {
        return tagRepository.findAllWithPostCount();
    }

    public Optional<Tag> getTagBySlug(String slug) {
        return tagRepository.findBySlug(slug);
    }

    public Optional<Tag> getTagById(Long id) {
        return tagRepository.findById(id);
    }

    @Transactional
    public Tag createTag(String name) {
        String slug = generateSlug(name);

        if (tagRepository.existsBySlug(slug)) {
            return tagRepository.findBySlug(slug).orElse(null);
        }

        Tag tag = Tag.builder()
                .name(name)
                .slug(slug)
                .build();
        return tagRepository.save(tag);
    }

    @Transactional
    public List<Tag> getOrCreateTags(List<String> tagNames) {
        return tagNames.stream()
                .map(String::trim)
                .filter(name -> !name.isEmpty())
                .map(this::getOrCreateTag)
                .collect(Collectors.toList());
    }

    private Tag getOrCreateTag(String name) {
        String slug = generateSlug(name);
        return tagRepository.findBySlug(slug)
                .orElseGet(() -> {
                    Tag tag = Tag.builder()
                            .name(name)
                            .slug(slug)
                            .build();
                    return tagRepository.save(tag);
                });
    }

    @Transactional
    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}
