package com.saam.backend.auth.application.usecases;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.saam.backend.auth.application.dto.LoginRequestDTO;
import com.saam.backend.auth.application.dto.LoginResponseDTO;
import com.saam.backend.auth.domain.entities.User;
import com.saam.backend.auth.domain.repositories.UserRepository;
import com.saam.backend.auth.exceptions.InvalidPasswordException;
import com.saam.backend.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginUserUseCase {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO execute(LoginRequestDTO dto) {
        Optional<User> user = userRepository.findByEmail(dto.getEmail());

        if (user.isEmpty()) {
            throw new InvalidPasswordException("O email " + dto.getEmail() + " não está cadastrado no sistema.");
        }

        if (!new BCryptPasswordEncoder().matches(dto.getPassword(), user.get().getPassword())) {
            throw new InvalidPasswordException("Senha inválida.");
        }

        String token = jwtUtil.generateToken(user.get().getEmail(), user.get().getRole().name());

        return LoginResponseDTO.builder()
                .id(user.get().getId())
                .username(user.get().getUsername())
                .email(user.get().getEmail())
                .role(user.get().getRole().name())
                .active(user.get().getActive())
                .token(token)
                .build();
    }
}
