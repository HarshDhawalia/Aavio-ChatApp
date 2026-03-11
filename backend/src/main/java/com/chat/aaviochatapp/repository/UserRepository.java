package com.chat.aaviochatapp.repository;

import com.chat.aaviochatapp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByMobile(String mobile);
    boolean existsByMobile(String mobile);
}