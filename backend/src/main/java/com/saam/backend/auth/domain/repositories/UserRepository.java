package com.saam.backend.auth.domain.repositories;

import java.util.Optional;

import com.saam.backend.auth.domain.entities.User;

public interface UserRepository {
    User save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}
