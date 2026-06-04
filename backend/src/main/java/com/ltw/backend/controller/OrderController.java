package com.ltw.backend.controller;

import com.ltw.backend.entity.Order;
import com.ltw.backend.entity.OrderItem;
import com.ltw.backend.entity.enums.OrderStatus;
import com.ltw.backend.entity.enums.PaymentMethod;
import com.ltw.backend.entity.enums.PaymentStatus;
import com.ltw.backend.repository.OrderRepository;
import com.ltw.backend.repository.OrderItemRepository;
import com.ltw.backend.repository.ProductRepository;
import com.ltw.backend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Data
    public static class OrderItemDto {
        private Integer product_id;
        private Integer quantity;
        private BigDecimal unit_price;
    }

    @Data
    public static class OrderDto {
        private Integer retailer_id;
        private String shipping_address;
        private String receiver_name;
        private String receiver_phone;
        private BigDecimal shipping_fee;
        private String payment_method;
        private List<OrderItemDto> items;
        private String status;
        private String payment_status;
    }

    @GetMapping
    public List<Order> getAll() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Integer id) {
        return orderRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody OrderDto dto) {
        if (dto.getShipping_address() == null || dto.getPayment_method() == null || dto.getItems() == null || dto.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc");
        }

        BigDecimal subtotal = dto.getItems().stream()
                .map(item -> item.getUnit_price().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal fee = dto.getShipping_fee() != null ? dto.getShipping_fee() : BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(fee);

        Order order = new Order();
        if (dto.getRetailer_id() != null) userRepository.findById(dto.getRetailer_id()).ifPresent(order::setUser);
        order.setShippingAddress(dto.getShipping_address());
        order.setReceiverName(dto.getReceiver_name());
        order.setReceiverPhone(dto.getReceiver_phone());
        order.setShippingFee(fee);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(PaymentMethod.valueOf(dto.getPayment_method()));
        order.setPaymentStatus(PaymentStatus.unpaid);
        order.setStatus(OrderStatus.pending);
        
        Order savedOrder = orderRepository.save(order);
        List<OrderItem> savedItems = new ArrayList<>();

        for (OrderItemDto itemDto : dto.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            productRepository.findById(itemDto.getProduct_id()).ifPresent(item::setProduct);
            item.setQuantity(itemDto.getQuantity());
            item.setUnitPrice(itemDto.getUnit_price());
            savedItems.add(orderItemRepository.save(item));

            // Decrement stock
            if (item.getProduct() != null) {
                item.getProduct().setStockQuantity(item.getProduct().getStockQuantity() - item.getQuantity());
                productRepository.save(item.getProduct());
            }
        }
        savedOrder.setOrderItems(savedItems);
        return ResponseEntity.status(201).body(savedOrder);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody OrderDto dto) {
        return orderRepository.findById(id).map(o -> {
            if (dto.getStatus() != null) o.setStatus(OrderStatus.valueOf(dto.getStatus()));
            if (dto.getPayment_status() != null) o.setPaymentStatus(PaymentStatus.valueOf(dto.getPayment_status()));
            return ResponseEntity.ok(orderRepository.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!orderRepository.existsById(id)) return ResponseEntity.notFound().build();
        orderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
