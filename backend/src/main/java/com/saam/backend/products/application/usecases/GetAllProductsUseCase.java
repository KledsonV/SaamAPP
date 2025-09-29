package com.saam.backend.products.application.usecases;

import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.saam.backend.products.application.dto.PaginatedResponseDTO;
import com.saam.backend.products.application.dto.ProductResponseDTO;
import com.saam.backend.products.domain.entities.Product;
import com.saam.backend.products.domain.repositories.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllProductsUseCase {

    private final ProductRepository productRepository;

    public PaginatedResponseDTO<ProductResponseDTO> execute(int page, int size) {
        Page<Product> productPage = productRepository.findAll(PageRequest.of(page, size));

        return PaginatedResponseDTO.<ProductResponseDTO>builder()
                .content(productPage.getContent().stream()
                        .map(product -> ProductResponseDTO.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .quantity(product.getQuantity())
                        .createdAt(product.getCreatedAt())
                        .build())
                        .collect(Collectors.toList()))
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }
}
