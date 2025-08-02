package com.blogpost.app.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blogpost.app.entity.User;

@Repository 
public interface UserRepository extends JpaRepository<User, Long>{
	User getByUserName(String userName);
}
