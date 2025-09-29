package com.saam.backend.products.application.usecases;

import org.springframework.stereotype.Service;

import com.saam.backend.products.domain.entities.Product;
import com.saam.backend.products.domain.repositories.ProductRepository;
import com.saam.backend.products.exceptions.ProductNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteProductUseCase {

    private final ProductRepository productRepository;

    public void execute(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                "Produto com ID " + id + " não foi encontrado."
        ));

        productRepository.deleteById(product.getId());
    }
}
