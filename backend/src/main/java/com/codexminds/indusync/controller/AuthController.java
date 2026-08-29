package com.codexminds.indusync.controller;

import com.codexminds.indusync.dto.LoginRequest;
import com.codexminds.indusync.dto.RegisterRequest;
import com.codexminds.indusync.dto.UserResponse;
import com.codexminds.indusync.entity.User;
import com.codexminds.indusync.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {
            User user = authService.register(request);

            return ResponseEntity.ok(
                    new UserResponse(user)
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {
            // Get user
            User user = authService.getUserByEmail(
                    request.getEmail()
            );

            // Generate JWT
            String token = authService.login(request);

            // Return token + user details
            Map<String, Object> response = new HashMap<>();

            response.put("token", token);
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}