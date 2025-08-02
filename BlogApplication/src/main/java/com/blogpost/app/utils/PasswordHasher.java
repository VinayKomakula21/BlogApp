package com.blogpost.app.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {
	private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	
	public static String hash(String rawPassword) {
		return encoder.encode(rawPassword);
	}
	
	public static boolean verify(String rawPassword, String hashedPassword) {
		return encoder.matches(rawPassword, hashedPassword);
	}
}
