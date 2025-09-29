package com.saam.backend.auth.application.usecases;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.saam.backend.auth.application.dto.CreateRequestDTO;
import com.saam.backend.auth.application.dto.CreateResponseDTO;
import com.saam.backend.auth.domain.entities.User;
import com.saam.backend.auth.domain.repositories.UserRepository;
import com.saam.backend.auth.exceptions.InvalidRoleException;
import com.saam.backend.auth.exceptions.UserAlreadyExistsException;
import com.saam.backend.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateUserUseCase {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public CreateResponseDTO execute(CreateRequestDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("O email " + dto.getEmail() + " já está cadastrado.");
        }

        User.RoleName role;
        try {
            role = User.RoleName.valueOf(dto.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidRoleException("Role inválida: " + dto.getRole());
        }

        String encodedPassword = new BCryptPasswordEncoder().encode(dto.getPassword());

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(encodedPassword)
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), savedUser.getRole().name());

        return CreateResponseDTO.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .active(savedUser.getActive())
                .token(token)
                .build();
    }
}
