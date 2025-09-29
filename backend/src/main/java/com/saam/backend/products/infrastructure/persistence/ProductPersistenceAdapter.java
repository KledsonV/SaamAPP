package com.saam.backend.products.infrastructure.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.saam.backend.products.domain.entities.Product;
import com.saam.backend.products.domain.repositories.ProductRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductPersistenceAdapter implements ProductRepository {

    private final JpaProductRepository jpaProductRepository;

    @Override
    public Product save(Product product) {
        return jpaProductRepository.save(product);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return jpaProductRepository.findById(id);
    }

    @Override
    public List<Product> findAll() {
        return jpaProductRepository.findAll();
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return jpaProductRepository.findAll(pageable);
    }

    @Override
    public void deleteById(Long id) {
        jpaProductRepository.deleteById(id);
    }
}
