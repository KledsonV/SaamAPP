package com.saam.backend.shared.responses;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Objeto que representa uma resposta de erro padrão")
public class ErrorResponseDTO {

    @Schema(description = "Data e hora do erro", example = "2025-09-26T23:59:59")
    private LocalDateTime timestamp;

    @Schema(description = "Código HTTP do erro", example = "400")
    private int status;

    @Schema(description = "Título ou tipo do erro", example = "Usuário já existe")
    private String error;

    @Schema(description = "Mensagem detalhada do erro", example = "O email test@email.com já está cadastrado.")
    private String message;

    @Schema(description = "Caminho da requisição que causou o erro", example = "/api/auth/register")
    private String path;
}
