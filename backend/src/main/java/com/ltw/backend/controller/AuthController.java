package com.ltw.backend.controller;

import com.ltw.backend.entity.User;
import com.ltw.backend.entity.enums.Role;
import com.ltw.backend.entity.enums.Status;
import com.ltw.backend.repository.UserRepository;
import com.ltw.backend.security.JwtService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Data
    public static class AuthRequest {
        private String username;
        private String password;
        private String email;
        private String phone_number;
        private String company_name;
        private String tax_code;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username đã tồn tại");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhone_number());
        user.setCompanyName(request.getCompany_name());
        user.setTaxCode(request.getTax_code());
        user.setRole(Role.retailer);
        user.setStatus(Status.pending);
        
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Map.of("message", "Đăng ký thành công, chờ phê duyệt."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(java.util.Map.of(
                "token", token, 
                "status", user.getStatus().name(), 
                "role", user.getRole().name()
        ));
    }
}
