package com.blogpost.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blogpost.app.entity.User;
import com.blogpost.app.exception.ResourceNotFoundException;
import com.blogpost.app.repository.UserRepository;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public boolean deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
        return true;
    }

    public User getUserByUserName(String userName) {
        User user = userRepository.getByUserName(userName);
        if (user == null) {
            throw new ResourceNotFoundException("User", "userName", userName);
        }
        return user;
    }

    public Optional<User> findUserByUserName(String userName) {
        return Optional.ofNullable(userRepository.getByUserName(userName));
    }

    public User updateUser(Long id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (user.getFirstName() != null && !user.getFirstName().equals(existing.getFirstName())) {
            existing.setFirstName(user.getFirstName());
        }
        if (user.getLastName() != null && !user.getLastName().equals(existing.getLastName())) {
            existing.setLastName(user.getLastName());
        }
        if (user.getAvatarUrl() != null && !user.getAvatarUrl().equals(existing.getAvatarUrl())) {
            existing.setAvatarUrl(user.getAvatarUrl());
        }

        return userRepository.save(existing);
    }

    public boolean existsByUserName(String userName) {
        return userRepository.getByUserName(userName) != null;
    }
}
