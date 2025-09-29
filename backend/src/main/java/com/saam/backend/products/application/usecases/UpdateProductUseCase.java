package com.saam.backend.products.application.usecases;

import org.springframework.stereotype.Service;

import com.saam.backend.products.application.dto.ProductRequestDTO;
import com.saam.backend.products.application.dto.ProductResponseDTO;
import com.saam.backend.products.application.validators.ProductValidator;
import com.saam.backend.products.domain.entities.Product;
import com.saam.backend.products.domain.repositories.ProductRepository;
import com.saam.backend.products.exceptions.ProductAlreadyExistsException;
import com.saam.backend.products.exceptions.ProductNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateProductUseCase {

    private final ProductRepository productRepository;
    private final ProductValidator productValidator;

    public ProductResponseDTO execute(Long id, ProductRequestDTO dto) {
        productValidator.validate(dto);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                "Produto com ID " + id + " não foi encontrado."
        ));

        boolean nameExists = productRepository.findAll().stream()
                .anyMatch(p -> !p.getId().equals(id) && p.getName().equalsIgnoreCase(dto.getName()));

        if (nameExists) {
            throw new ProductAlreadyExistsException("Já existe outro produto com o nome '" + dto.getName() + "'.");
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());

        Product updatedProduct = productRepository.save(product);

        return ProductResponseDTO.builder()
                .id(updatedProduct.getId())
                .name(updatedProduct.getName())
                .description(updatedProduct.getDescription())
                .price(updatedProduct.getPrice())
                .quantity(updatedProduct.getQuantity())
                .build();
    }
}
