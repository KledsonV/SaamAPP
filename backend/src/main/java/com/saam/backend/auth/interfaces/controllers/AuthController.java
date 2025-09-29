package com.saam.backend.auth.interfaces.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saam.backend.auth.application.dto.CreateRequestDTO;
import com.saam.backend.auth.application.dto.CreateResponseDTO;
import com.saam.backend.auth.application.dto.LoginRequestDTO;
import com.saam.backend.auth.application.dto.LoginResponseDTO;
import com.saam.backend.auth.application.usecases.CreateUserUseCase;
import com.saam.backend.auth.application.usecases.LoginUserUseCase;
import com.saam.backend.auth.interfaces.docs.AuthControllerDocs;
import com.saam.backend.security.jwt.JwtUtil;
import com.saam.backend.shared.responses.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController implements AuthControllerDocs {

    private final CreateUserUseCase createUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final JwtUtil jwtUtil;

    @PostMapping("login")
    @Override
    public ResponseEntity<ApiResponse<LoginResponseDTO>> AuthLogin(
            @Valid @RequestBody LoginRequestDTO dto) {

        LoginResponseDTO response = loginUserUseCase.execute(dto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(
                HttpStatus.OK.value(),
                "Login realizado com sucesso.",
                response
        ));
    }

    @PostMapping("register")
    @Override
    public ResponseEntity<ApiResponse<CreateResponseDTO>> AuthRegister(
            @Valid @RequestBody CreateRequestDTO dto) {

        CreateResponseDTO response = createUserUseCase.execute(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                HttpStatus.CREATED.value(),
                "Usuário criado com sucesso",
                response
        ));
    }

    @GetMapping("validate")
    @Override
    public ResponseEntity<ApiResponse<String>> AuthValidate(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        boolean isValid = jwtUtil.validateToken(token);

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), "Token inválido ou expirado"));
        }

        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token);

        return ResponseEntity.ok(ApiResponse.success(
                HttpStatus.OK.value(),
                "Token válido",
                "Usuário autenticado: " + email + " | Role: " + role
        ));
    }
}
