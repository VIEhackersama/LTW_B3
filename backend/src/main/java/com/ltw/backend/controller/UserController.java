package com.ltw.backend.controller;

import com.ltw.backend.entity.User;
import com.ltw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody User user) {
        if (user.getUsername() == null || user.getPassword() == null || user.getEmail() == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc");
        }
        return ResponseEntity.status(201).body(userRepository.save(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody User updates) {
        return userRepository.findById(id).map(user -> {
            if (updates.getEmail() != null) user.setEmail(updates.getEmail());
            if (updates.getPhoneNumber() != null) user.setPhoneNumber(updates.getPhoneNumber());
            if (updates.getCompanyName() != null) user.setCompanyName(updates.getCompanyName());
            if (updates.getTaxCode() != null) user.setTaxCode(updates.getTaxCode());
            if (updates.getRole() != null) user.setRole(updates.getRole());
            if (updates.getStatus() != null) user.setStatus(updates.getStatus());
            if (updates.getPassword() != null && !updates.getPassword().isEmpty()) user.setPassword(updates.getPassword());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
