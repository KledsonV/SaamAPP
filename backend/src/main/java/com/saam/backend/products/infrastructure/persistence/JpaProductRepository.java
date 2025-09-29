package com.saam.backend.products.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saam.backend.products.domain.entities.Product;

public interface JpaProductRepository extends JpaRepository<Product, Long> {}