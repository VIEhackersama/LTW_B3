package com.ltw.backend.controller;

import com.ltw.backend.entity.Product;
import com.ltw.backend.entity.enums.ProductStatus;
import com.ltw.backend.repository.CategoryRepository;
import com.ltw.backend.repository.ProductRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Data
    public static class ProductDto {
        private String sku;
        private String name;
        private BigDecimal wholesale_price;
        private Integer min_order_qty;
        private Integer stock_quantity;
        private Integer category_id;
        private String status;
        private String manufacturer_name;
        private String origin_country;
        private String image_url;
    }

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ProductDto dto) {
        Product p = new Product();
        p.setSku(dto.getSku());
        p.setName(dto.getName());
        p.setWholesalePrice(dto.getWholesale_price());
        p.setMinOrderQty(dto.getMin_order_qty() != null ? dto.getMin_order_qty() : 1);
        p.setStockQuantity(dto.getStock_quantity() != null ? dto.getStock_quantity() : 0);
        p.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.active);
        p.setManufacturerName(dto.getManufacturer_name());
        p.setOriginCountry(dto.getOrigin_country());
        p.setImageUrl(dto.getImage_url());

        if (dto.getCategory_id() != null) {
            categoryRepository.findById(dto.getCategory_id()).ifPresent(p::setCategory);
        }
        return ResponseEntity.status(201).body(productRepository.save(p));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Integer id) {
        return productRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody ProductDto dto) {
        return productRepository.findById(id).map(p -> {
            if (dto.getName() != null) p.setName(dto.getName());
            if (dto.getWholesale_price() != null) p.setWholesalePrice(dto.getWholesale_price());
            if (dto.getMin_order_qty() != null) p.setMinOrderQty(dto.getMin_order_qty());
            if (dto.getStock_quantity() != null) p.setStockQuantity(dto.getStock_quantity());
            if (dto.getStatus() != null) p.setStatus(ProductStatus.valueOf(dto.getStatus()));
            if (dto.getManufacturer_name() != null) p.setManufacturerName(dto.getManufacturer_name());
            if (dto.getOrigin_country() != null) p.setOriginCountry(dto.getOrigin_country());
            if (dto.getImage_url() != null) p.setImageUrl(dto.getImage_url());
            if (dto.getCategory_id() != null) {
                categoryRepository.findById(dto.getCategory_id()).ifPresent(p::setCategory);
            }
            return ResponseEntity.ok(productRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
