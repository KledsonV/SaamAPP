package com.saam.backend.products.application.validators;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.saam.backend.products.application.dto.ProductRequestDTO;
import com.saam.backend.products.exceptions.InvalidProductDataException;

@Component
public class ProductValidator {

    public void validate(ProductRequestDTO dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new InvalidProductDataException("O nome do produto é obrigatório.");
        }

        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            throw new InvalidProductDataException("A descrição do produto é obrigatória.");
        }

        if (dto.getPrice() == null || dto.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidProductDataException("O preço do produto deve ser maior que zero.");
        }

        if (dto.getQuantity() == null || dto.getQuantity() < 0) {
            throw new InvalidProductDataException("A quantidade do produto não pode ser negativa.");
        }
    }
}
