package com.chat.aaviochatapp.controller;

import com.chat.aaviochatapp.model.User;
import com.chat.aaviochatapp.repository.UserRepository;
import com.chat.aaviochatapp.security.JwtUtil;
import com.chat.aaviochatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        userService.register(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        User existing;
        if (user.getMobile() != null && !user.getMobile().isEmpty()) {
            existing = userRepository.findByMobile(user.getMobile())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            existing = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        if (!passwordEncoder.matches(user.getPassword(), existing.getPassword()))
            throw new RuntimeException("Invalid password");
        userService.updateStatus(existing.getId(), "ONLINE");
        String token = jwtUtil.generateToken(existing.getEmail());
        return Map.of(
                "token", token,
                "userId", existing.getId(),
                "name", existing.getName(),
                "email", existing.getEmail()
        );
    }
}