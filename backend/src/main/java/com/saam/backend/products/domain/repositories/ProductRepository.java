package com.saam.backend.products.domain.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.saam.backend.products.domain.entities.Product;

public interface ProductRepository {

    Product save(Product product);
    Optional<Product> findById(Long id);
    List<Product> findAll();
    Page<Product> findAll (Pageable pageable);
    void deleteById(Long id);

}
