package com.saam.backend.products.application.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequestDTO {

    @NotBlank(message = "O nome do produto é obrigatório")
    @Size(min = 3, max = 100, message = "O nome do produto deve ter entre 3 e 100 caracteres")
    private String name;

    @NotBlank(message = "A descrição do produto é obrigatória")
    @Size(min = 5, max = 255, message = "A descrição deve ter entre 5 e 255 caracteres")
    private String description;

    @NotNull(message = "O preço do produto é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "O preço deve ser maior que zero")
    @Digits(integer = 10, fraction = 2, message = "Preço inválido: máximo 10 dígitos e 2 casas decimais")
    private BigDecimal price;

    @NotNull(message = "A quantidade do produto é obrigatória")
    @Min(value = 0, message = "A quantidade não pode ser negativa")
    private Integer quantity;
}
