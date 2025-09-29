package com.saam.backend.products.application.usecases;

import org.springframework.stereotype.Service;

import com.saam.backend.products.application.dto.ProductRequestDTO;
import com.saam.backend.products.application.dto.ProductResponseDTO;
import com.saam.backend.products.application.validators.ProductValidator;
import com.saam.backend.products.domain.entities.Product;
import com.saam.backend.products.domain.repositories.ProductRepository;
import com.saam.backend.products.exceptions.ProductAlreadyExistsException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateProductUseCase {

    private final ProductRepository productRepository;
    private final ProductValidator productValidator;

    public ProductResponseDTO execute(ProductRequestDTO dto) {
        productValidator.validate(dto);

        boolean exists = productRepository.findAll().stream()
                .anyMatch(product -> product.getName().equalsIgnoreCase(dto.getName()));

        if (exists) {
            throw new ProductAlreadyExistsException("O produto com nome '" + dto.getName() + "' já existe.");
        }

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .build();

        Product savedProduct = productRepository.save(product);

        return ProductResponseDTO.builder()
                .id(savedProduct.getId())
                .name(savedProduct.getName())
                .description(savedProduct.getDescription())
                .price(savedProduct.getPrice())
                .quantity(savedProduct.getQuantity())
                .build();
    }
}
