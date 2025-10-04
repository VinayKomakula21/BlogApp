package com.blogpost.app.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogpost.app.dto.LoginRequest;
import com.blogpost.app.dto.LoginResponse;
import com.blogpost.app.dto.RegisterRequest;
import com.blogpost.app.service.AuthService;

@RestController
@RequestMapping("/Auth")
@Deprecated // This controller is deprecated, use AuthController instead
public class UserApi {
	@Autowired
	private AuthService authService;

	@PostMapping("/SignUp")
	public ResponseEntity<LoginResponse> createUser(@RequestBody RegisterRequest registerRequest){
		if(registerRequest == null) {
			return ResponseEntity.badRequest().build();
		}

		try {
			return ResponseEntity.ok(authService.register(registerRequest));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest){
		if(loginRequest == null) {
			return ResponseEntity.badRequest().build();
		}

		try {
			return ResponseEntity.ok(authService.login(loginRequest));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

}
