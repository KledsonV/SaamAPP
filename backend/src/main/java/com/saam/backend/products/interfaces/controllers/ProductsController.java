package com.saam.backend.products.interfaces.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.saam.backend.products.application.dto.PaginatedResponseDTO;
import com.saam.backend.products.application.dto.ProductRequestDTO;
import com.saam.backend.products.application.dto.ProductResponseDTO;
import com.saam.backend.products.application.usecases.CreateProductUseCase;
import com.saam.backend.products.application.usecases.DeleteProductUseCase;
import com.saam.backend.products.application.usecases.GetAllProductsUseCase;
import com.saam.backend.products.application.usecases.GetProductByIdUseCase;
import com.saam.backend.products.application.usecases.UpdateProductUseCase;
import com.saam.backend.products.interfaces.docs.ProductsControllerDocs;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductsController implements ProductsControllerDocs {

    private final CreateProductUseCase createProductUseCase;
    private final GetProductByIdUseCase getProductByIdUseCase;
    private final GetAllProductsUseCase getAllProductsUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;

    @PostMapping
    @Override
    public ResponseEntity<ProductResponseDTO> create(@RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(createProductUseCase.execute(dto));
    }

    @GetMapping("/{id}")
    @Override
    public ResponseEntity<ProductResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(getProductByIdUseCase.execute(id));
    }

    @GetMapping
    @Override
    public ResponseEntity<PaginatedResponseDTO<ProductResponseDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(getAllProductsUseCase.execute(page, size));
    }

    @PutMapping("/{id}")
    @Override
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(updateProductUseCase.execute(id, dto));
    }

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteProductUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
