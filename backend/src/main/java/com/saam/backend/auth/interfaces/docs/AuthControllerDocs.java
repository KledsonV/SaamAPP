package com.saam.backend.auth.interfaces.docs;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.saam.backend.auth.application.dto.CreateRequestDTO;
import com.saam.backend.auth.application.dto.CreateResponseDTO;
import com.saam.backend.auth.application.dto.LoginRequestDTO;
import com.saam.backend.auth.application.dto.LoginResponseDTO;
import com.saam.backend.shared.responses.ApiResponse;
import com.saam.backend.shared.responses.ErrorResponseDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Autenticação", description = "Endpoints para autenticação, registro e validação de tokens JWT")
public interface AuthControllerDocs {

    @Operation(
            summary = "Login do usuário",
            description = "Autentica um usuário com **email e senha** e retorna um token JWT para acessar endpoints protegidos.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Credenciais do usuário",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = LoginRequestDTO.class),
                            examples = @ExampleObject(value = """
                    {
                      "email": "user@email.com",
                      "password": "123456"
                    }
                """)
                    )
            ),
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "200",
                        description = "Login realizado com sucesso",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = LoginResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "status": 200,
                          "message": "Login realizado com sucesso.",
                          "data": {
                              "id": "4ade8288-6e03-47b4-ab8d-016e84847355",
                              "username": "User Test",
                              "email": "user@gmail.com",
                              "role": "USER",
                              "active": true,
                              "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6InVzZXJAZ21haWwuY29tIiwiaWF0IjoxNzU4OTY3NTMyLCJleHAiOjE3NTg5NzExMzJ9.pbLvyVVzj-SBNz-PejJdkLnJwZOlKPvnMuOHmZtgN9k"
                          },
                          "timestamp": "2025-09-27T07:05:32.235068181"
                        }
                    """)
                        )
                ),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "401",
                        description = "Senha incorreta",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "timestamp": "2025-09-27T07:20:00",
                          "status": 401,
                          "error": "Credenciais inválidas",
                          "message": "Senha incorreta.",
                          "path": "/api/auth/login"
                        }
                    """)
                        )
                ),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "404",
                        description = "Usuário não encontrado",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "timestamp": "2025-09-27T07:21:00",
                          "status": 404,
                          "error": "Usuário não encontrado",
                          "message": "O email informado não está cadastrado.",
                          "path": "/api/auth/login"
                        }
                    """)
                        )
                )
            }
    )
    ResponseEntity<ApiResponse<LoginResponseDTO>> AuthLogin(@RequestBody LoginRequestDTO dto);

    @Operation(
            summary = "Registro de novo usuário",
            description = "Cria um novo usuário no sistema com **nome, email, senha e role**.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados do novo usuário",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreateRequestDTO.class),
                            examples = @ExampleObject(value = """
                    {
                      "username": "João Silva",
                      "email": "joao@email.com",
                      "password": "123456",
                      "role": "USER"
                    }
                """)
                    )
            ),
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "201",
                        description = "Usuário criado com sucesso",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = CreateResponseDTO.class)
                        )
                ),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "400",
                        description = "Dados inválidos",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject("""
                                        {
                                            "email": "O e-mail é obrigatório",
                                            "password": "A senha deve conter letra, número e caractere especial"
                                        }
                                        """)
                        )
                ),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "409",
                        description = "Email já cadastrado.",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject("""
                                        {
                                            "timestamp": "2025-09-27T07:14:42.847806063",
                                            "status": 409,
                                            "error": "Usuário já existe",
                                            "message": "O email user@gmail.com já está cadastrado.",
                                            "path": "/api/auth/register"
                                        }
                                        """)
                        )
                )
            }
    )
    ResponseEntity<ApiResponse<CreateResponseDTO>> AuthRegister(@RequestBody CreateRequestDTO dto);

    @Operation(
            summary = "Valida um token JWT",
            description = "Valida se o token JWT fornecido no header é válido e retorna as informações do usuário autenticado.",
            parameters = {
                @Parameter(
                        name = "Authorization",
                        description = "Token JWT no formato **Bearer {token}**",
                        required = true,
                        example = "Bearer eyJhbGciOiJIUzI1NiJ9..."
                )
            },
            responses = {
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "200",
                        description = "Token válido",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ApiResponse.class),
                                examples = @ExampleObject(value = """
                        {
                          "status": 200,
                          "message": "Token válido",
                          "data": "Usuário autenticado: user@gmail.com | Role: USER",
                          "timestamp": "2025-09-27T07:25:00"
                        }
                    """)
                        )
                ),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "401",
                        description = "Token inválido ou expirado",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "timestamp": "2025-09-27T07:26:00",
                          "status": 401,
                          "error": "Token inválido ou expirado",
                          "message": "O token fornecido não é válido ou expirou.",
                          "path": "/api/auth/validate"
                        }
                    """)
                        )
                ),
                @io.swagger.v3.oas.annotations.responses.ApiResponse(
                        responseCode = "403",
                        description = "Sem permissão",
                        content = @Content(
                                mediaType = "application/json"
                        )
                )
            }
    )
    ResponseEntity<ApiResponse<String>> AuthValidate(@RequestHeader("Authorization") String token);
}
