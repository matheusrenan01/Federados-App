package com.seuapp.controller;

import com.seuapp.dto.LoginDTO;
import com.seuapp.dto.RegisterDTO;
import com.seuapp.repository.UserRepository;
import com.seuapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Erro: Email já cadastrado!");
        }
        return ResponseEntity.ok(authService.registrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        return authService.login(dto.getEmail(), dto.getSenha())
                .map(user -> ResponseEntity.ok("Login realizado!"))
                .orElse(ResponseEntity.status(401).body("Erro nas credenciais"));
    }
}