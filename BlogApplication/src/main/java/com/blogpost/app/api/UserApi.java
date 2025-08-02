package com.blogpost.app.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogpost.app.pojo.AuthResponse;
import com.blogpost.app.pojo.LoginRequest;
import com.blogpost.app.pojo.RegisterRequest;
import com.blogpost.app.service.AuthService;

@RestController
@RequestMapping("/Auth")
public class UserApi {
	@Autowired
	private AuthService authService;
	
	@PostMapping("/SignUp")
	public ResponseEntity<AuthResponse> createUser(@RequestBody RegisterRequest registerRequest){
		if(registerRequest == null) {
			return ResponseEntity.badRequest().build();
		}
		
		return ResponseEntity.ok(authService.register(registerRequest));
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest loginRequest){
		if(loginRequest == null) {
			return ResponseEntity.badRequest().build();
		}
		
		return ResponseEntity.ok(authService.login(loginRequest));
	}

}
