package com.blogpost.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blogpost.app.entity.User;
import com.blogpost.app.pojo.AuthResponse;
import com.blogpost.app.pojo.LoginRequest;
import com.blogpost.app.pojo.RegisterRequest;
import com.blogpost.app.utils.PasswordHasher;

@Service
public class AuthService {
	
	@Autowired
	private UserService userService;
	
	public AuthResponse login(LoginRequest loginRequest) {
		AuthResponse response = new AuthResponse();
		
		User user = userService.getUserByUserName(loginRequest.getUserName());
		
		if(user != null) {
			response.setAuthenticated(PasswordHasher.verify(loginRequest.getPassword(), user.getPassword()));
		}
		
		return response;
	}
	
	public AuthResponse register(RegisterRequest registerRequest) {
		AuthResponse response = new AuthResponse(false);
		
		User user = User.builder()
				.firstName(registerRequest.getFirstName())
				.lastName(registerRequest.getLastName())
				.password(PasswordHasher.hash(registerRequest.getPassword()))
				.userName(registerRequest.getUserName())
				.avatarUrl(null)
				.createdAt(System.currentTimeMillis())
				.updatedAt(System.currentTimeMillis())
				.build();
		
		User savedUser = userService.createUser(user);
		
		
		if(savedUser != null) {
			response.setAuthenticated(true);
			return response;
		}
		
		return response;
		
	}
}
