package com.saam.backend.products.interfaces.docs;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.saam.backend.products.application.dto.PaginatedResponseDTO;
import com.saam.backend.products.application.dto.ProductRequestDTO;
import com.saam.backend.products.application.dto.ProductResponseDTO;
import com.saam.backend.shared.responses.ErrorResponseDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Produtos", description = "Gerenciamento completo de produtos: criação, listagem, atualização e exclusão")
public interface ProductsControllerDocs {

    @Operation(
            summary = "Cria um novo produto",
            description = "Registra um novo produto no sistema com nome, descrição, preço e quantidade.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados do produto a ser criado",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ProductRequestDTO.class),
                            examples = @ExampleObject(value = """
                    {
                      "name": "Notebook Dell Inspiron",
                      "description": "Notebook Dell com processador i7 e 16GB de RAM",
                      "price": 5500.00,
                      "quantity": 10
                    }
                """)
                    )
            ),
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Produto criado com sucesso",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ProductResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "id": 1,
                          "name": "Notebook Dell Inspiron",
                          "description": "Notebook Dell com processador i7 e 16GB de RAM",
                          "price": 5500.00,
                          "quantity": 10
                        }
                    """)
                        )
                ),
                @ApiResponse(
                        responseCode = "409",
                        description = "Produto já existe",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "timestamp": "2025-09-27T09:00:00",
                          "status": 409,
                          "error": "Produto já existe",
                          "message": "O produto com nome 'Notebook Dell Inspiron' já existe.",
                          "path": "/api/products"
                        }
                    """)
                        )
                ),
                @ApiResponse(
                        responseCode = "400",
                        description = "Dados inválidos",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class)
                        )
                )
            }
    )
    ResponseEntity<ProductResponseDTO> create(@RequestBody ProductRequestDTO dto);

    @Operation(
            summary = "Busca produto por ID",
            description = "Recupera os detalhes de um produto específico com base no seu ID.",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "ID do produto a ser buscado",
                        example = "1",
                        required = true
                )
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Produto encontrado com sucesso",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ProductResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "id": 1,
                          "name": "Notebook Dell Inspiron",
                          "description": "Notebook Dell com processador i7 e 16GB de RAM",
                          "price": 5500.00,
                          "quantity": 10
                        }
                    """)
                        )
                ),
                @ApiResponse(
                        responseCode = "404",
                        description = "Produto não encontrado",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "timestamp": "2025-09-27T09:05:00",
                          "status": 404,
                          "error": "Produto não encontrado",
                          "message": "Produto com ID 99 não foi encontrado.",
                          "path": "/api/products/99"
                        }
                    """)
                        )
                )
            }
    )
    ResponseEntity<ProductResponseDTO> getById(@PathVariable Long id);

    @Operation(
            summary = "Lista todos os produtos com paginação",
            description = "Retorna uma lista paginada de produtos cadastrados no sistema.",
            parameters = {
                @Parameter(name = "page", description = "Número da página (inicia em 0)", example = "0"),
                @Parameter(name = "size", description = "Quantidade de itens por página", example = "10")
            },
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Lista paginada de produtos retornada com sucesso",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = PaginatedResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "content": [
                            {
                              "id": 1,
                              "name": "Notebook Dell Inspiron",
                              "description": "Notebook Dell com processador i7 e 16GB de RAM",
                              "price": 5500.00,
                              "quantity": 10
                            },
                            {
                              "id": 2,
                              "name": "Mouse Gamer Razer",
                              "description": "Mouse Gamer RGB com 8 botões programáveis",
                              "price": 350.00,
                              "quantity": 50
                            }
                          ],
                          "page": 0,
                          "size": 10,
                          "totalElements": 2,
                          "totalPages": 1,
                          "last": true
                        }
                    """)
                        )
                )
            }
    )
    ResponseEntity<PaginatedResponseDTO<ProductResponseDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    );

    @Operation(
            summary = "Atualiza um produto existente",
            description = "Atualiza as informações de um produto com base no ID informado.",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "ID do produto a ser atualizado",
                        required = true,
                        example = "1"
                )
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados do produto a serem atualizados",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ProductRequestDTO.class),
                            examples = @ExampleObject(value = """
                    {
                      "name": "Notebook Dell Inspiron Plus",
                      "description": "Notebook Dell atualizado com processador i9",
                      "price": 7500.00,
                      "quantity": 5
                    }
                """)
                    )
            ),
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Produto atualizado com sucesso",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ProductResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "id": 1,
                          "name": "Notebook Dell Inspiron Plus",
                          "description": "Notebook Dell atualizado com processador i9",
                          "price": 7500.00,
                          "quantity": 5
                        }
                    """)
                        )
                ),
                @ApiResponse(
                        responseCode = "404",
                        description = "Produto não encontrado",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "timestamp": "2025-09-27T09:15:00",
                          "status": 404,
                          "error": "Produto não encontrado",
                          "message": "Produto com ID 99 não foi encontrado.",
                          "path": "/api/products/99"
                        }
                    """)
                        )
                ),
                @ApiResponse(
                        responseCode = "409",
                        description = "Produto duplicado",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "timestamp": "2025-09-27T09:16:00",
                          "status": 409,
                          "error": "Produto já existe",
                          "message": "Já existe outro produto com o nome 'Notebook Dell Inspiron Plus'.",
                          "path": "/api/products/1"
                        }
                    """)
                        )
                )
            }
    )
    ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @RequestBody ProductRequestDTO dto);

    @Operation(
            summary = "Deleta um produto",
            description = "Remove um produto específico com base no ID informado.",
            parameters = {
                @Parameter(
                        name = "id",
                        description = "ID do produto a ser deletado",
                        example = "1",
                        required = true
                )
            },
            responses = {
                @ApiResponse(
                        responseCode = "204",
                        description = "Produto deletado com sucesso"
                ),
                @ApiResponse(
                        responseCode = "404",
                        description = "Produto não encontrado",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(implementation = ErrorResponseDTO.class),
                                examples = @ExampleObject(value = """
                        {
                          "timestamp": "2025-09-27T09:20:00",
                          "status": 404,
                          "error": "Produto não encontrado",
                          "message": "Produto com ID 99 não foi encontrado.",
                          "path": "/api/products/99"
                        }
                    """)
                        )
                )
            }
    )
    ResponseEntity<Void> delete(@PathVariable Long id);
}
