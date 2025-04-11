package com.hrapp.controller;

import com.hrapp.model.User;
import com.hrapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// http://192.168.1.22/
@CrossOrigin(origins = "*")
// @CrossOrigin(origins = "http://192.168.1.22:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password))
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Login successful");
                    response.put("username", user.getUsername());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).body(Map.of("message", "Invalid credentials")));
    }
}
