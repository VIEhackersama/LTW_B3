package com.ltw.backend.security;

import com.ltw.backend.entity.User;
import com.ltw.backend.entity.enums.Role;
import com.ltw.backend.entity.enums.Status;
import com.ltw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin1").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin1");
            admin.setPassword(passwordEncoder.encode("adminadmin"));
            admin.setEmail("admin1@ltw.com");
            admin.setRole(Role.admin);
            admin.setStatus(Status.active);
            userRepository.save(admin);
        }
    }
}
