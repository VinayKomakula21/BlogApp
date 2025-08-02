package com.blogpost.app.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "comment")
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column
	private String commentTitle;
	@Column
    private String commentContent;
	
	@ManyToOne
	private User user;
	
	@ManyToMany
	@JoinTable(
		    name = "comment_post",
		    joinColumns = @JoinColumn(name = "comment_id"),
		    inverseJoinColumns = @JoinColumn(name = "post_id")
		)
	private List<Post> post;
	
	@Column
	private Long createdAt;
	
	
}
