package com.blogpost.app.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogpost.app.annotation.PublicEndpoint;
import com.blogpost.app.annotation.RequiresAuth;
import com.blogpost.app.dto.TagResponse;
import com.blogpost.app.entity.Tag;
import com.blogpost.app.service.TagService;

@RestController
@RequestMapping("/api/tags")
public class TagApi {

    @Autowired
    private TagService tagService;

    @GetMapping
    @PublicEndpoint
    public ResponseEntity<List<TagResponse>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        List<TagResponse> response = tags.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    @PublicEndpoint
    public ResponseEntity<TagResponse> getTagBySlug(@PathVariable String slug) {
        return tagService.getTagBySlug(slug)
                .map(tag -> ResponseEntity.ok(toResponse(tag)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @RequiresAuth
    public ResponseEntity<TagResponse> createTag(@RequestBody TagRequest request) {
        Tag tag = tagService.createTag(request.getName());
        return ResponseEntity.ok(toResponse(tag));
    }

    private TagResponse toResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .slug(tag.getSlug())
                .postsCount(tag.getPostsCount())
                .build();
    }

    public static class TagRequest {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
