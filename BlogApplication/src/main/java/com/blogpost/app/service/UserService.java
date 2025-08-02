package com.blogpost.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blogpost.app.entity.User;
import com.blogpost.app.repository.UserRepository;

@Service 
public class UserService{
	
	@Autowired
	private UserRepository userRepository;
	

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).get();
    }
	
	public boolean deleteUserById(Long id){
		userRepository.deleteById(id);
		
		return true;
	}
	
	public User getUserByUserName(String userName) {
		return userRepository.getByUserName(userName);
	}
	
	
	public User updateUser(Long id, User user) {
		User existing = userRepository.findById(id).get();
		
		if (user.getFirstName() != existing.getFirstName()) {
			existing.setFirstName(user.getFirstName());
		}
		if (user.getLastName() != existing.getLastName()) {
			existing.setLastName(user.getLastName());
		}
		
		return userRepository.save(existing);
	
	}
	
}
