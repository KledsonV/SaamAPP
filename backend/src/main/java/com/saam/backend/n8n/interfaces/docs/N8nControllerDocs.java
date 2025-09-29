package com.saam.backend.n8n.interfaces.docs;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.saam.backend.n8n.interfaces.controllers.N8nController.ApiError;
import com.saam.backend.n8n.interfaces.controllers.N8nController.ReportPayload;
import com.saam.backend.n8n.interfaces.controllers.N8nController.WelcomePayload;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "N8N", description = "Endpoints para integração com fluxos do n8n, permitindo geração de relatórios e envio de mensagens de boas-vindas.")
public interface N8nControllerDocs {

    @Operation(
            summary = "Gera relatório via n8n",
            description = "Envia uma solicitação para geração de relatórios ao fluxo configurado no n8n. "
            + "Este endpoint aceita informações como tipo do relatório, formato, datas, e dados de produtos.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados necessários para geração do relatório.",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ReportPayload.class),
                            examples = @ExampleObject(value = """
                            {
                              "type": "sales",
                              "format": "PDF",
                              "email": "usuario@empresa.com",
                              "token": "jwt-token-opcional",
                              "name": "João Silva",
                              "totalProdutos": 25,
                              "valorTotal": 12350.75,
                              "startDate": "2025-09-01",
                              "endDate": "2025-09-27"
                            }
                            """)
                    )
            ),
            parameters = {
                @Parameter(
                        name = "Authorization",
                        description = "Token JWT opcional para autenticação com o serviço do n8n.",
                        example = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                )
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Relatório gerado com sucesso",
                        content = @Content(
                                mediaType = "application/json",
                                examples = @ExampleObject(value = """
                                {
                                  "message": "Relatório gerado e enviado para o e-mail usuario@empresa.com",
                                  "status": "success"
                                }
                                """)
                        )
                ),
                @ApiResponse(
                        responseCode = "502",
                        description = "Falha ao contactar o serviço de automação n8n",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ApiError.class),
                                examples = @ExampleObject(value = """
                                {
                                  "status": 502,
                                  "error": "Falha ao contactar serviço de automação",
                                  "message": "Connection refused: n8n service unavailable"
                                }
                                """)
                        )
                )
            }
    )
    ResponseEntity<?> generate(
            @RequestBody ReportPayload payload,
            @RequestHeader(value = "Authorization", required = false) String authorization
    );

    @Operation(
            summary = "Envia mensagem de boas-vindas",
            description = "Envia os dados de um novo usuário para o fluxo do n8n, que será responsável por processar "
            + "e disparar uma mensagem de boas-vindas personalizada.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados do usuário para envio da mensagem de boas-vindas.",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WelcomePayload.class),
                            examples = @ExampleObject(value = """
                            {
                              "name": "Maria Oliveira",
                              "email": "maria.oliveira@empresa.com"
                            }
                            """)
                    )
            ),
            parameters = {
                @Parameter(
                        name = "Authorization",
                        description = "Token JWT obrigatório para autenticação com o serviço do n8n.",
                        required = true,
                        example = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                )
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Mensagem de boas-vindas enviada com sucesso",
                        content = @Content(
                                mediaType = "application/json",
                                examples = @ExampleObject(value = """
                                {
                                  "message": "Mensagem de boas-vindas enviada para maria.oliveira@empresa.com",
                                  "status": "success"
                                }
                                """)
                        )
                ),
                @ApiResponse(
                        responseCode = "502",
                        description = "Falha ao contactar o serviço de automação n8n",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ApiError.class),
                                examples = @ExampleObject(value = """
                                {
                                  "status": 502,
                                  "error": "Falha ao contactar serviço de automação",
                                  "message": "Timeout ao tentar comunicar com o webhook do n8n"
                                }
                                """)
                        )
                )
            }
    )
    ResponseEntity<?> welcomeUser(
            @RequestBody WelcomePayload payload,
            @RequestHeader(value = "Authorization", required = true) String authorization
    );
}
