package com.blogpost.app.entity;


import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String password;
	@Column(unique = true, nullable = false)
	private String userName;
	@Column(nullable = false)
	private String firstName;
	@Column
	private String lastName;
	@Column
	private String avatarUrl;

	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false)
	@Builder.Default
	private UserRole role = UserRole.USER;

	@Column(name = "refresh_token", columnDefinition = "TEXT")
	private String refreshToken;

	@Column(name = "token_version")
	@Builder.Default
	private Integer tokenVersion = 0;

	@Column(updatable = false)
	@CreationTimestamp
	private Long createdAt;
	@Column
	@UpdateTimestamp
    private Long updatedAt;


}
