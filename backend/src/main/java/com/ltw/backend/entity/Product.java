package com.ltw.backend.entity;

import com.ltw.backend.entity.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, length = 50, nullable = false)
    private String sku;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(name = "wholesale_price", precision = 15, scale = 2, nullable = false)
    private BigDecimal wholesalePrice;

    @Column(name = "min_order_qty", nullable = false)
    private Integer minOrderQty;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "manufacturer_name", length = 255)
    private String manufacturerName;

    @Column(name = "origin_country", length = 100)
    private String originCountry;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
