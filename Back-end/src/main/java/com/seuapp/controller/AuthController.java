package com.seuapp.controller;

import com.seuapp.dto.EsqueciSenhaDTO;
import com.seuapp.dto.LoginDTO;
import com.seuapp.dto.RedefinirSenhaDTO;
import com.seuapp.dto.RegisterDTO;
import com.seuapp.dto.VerificarCodigoDTO;
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

    // Etapa 1: usuário digitou o email, back-end gera o código e envia por email
    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@RequestBody EsqueciSenhaDTO dto) {
        authService.gerarCodigoRecuperacao(dto.getEmail());
        // Sempre retorna sucesso, mesmo se o email não existir,
        // pra não deixar alguém descobrir quais emails estão cadastrados.
        return ResponseEntity.ok("Se o email existir, um código foi enviado.");
    }

    // Etapa 2: usuário digitou o código de 6 dígitos
    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@RequestBody VerificarCodigoDTO dto) {
        boolean valido = authService.verificarCodigo(dto.getEmail(), dto.getCodigo());
        if (valido) {
            return ResponseEntity.ok("Código válido!");
        }
        return ResponseEntity.status(400).body("Código inválido ou expirado.");
    }

    // Etapa 3: usuário digitou a nova senha
    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody RedefinirSenhaDTO dto) {
        boolean ok = authService.redefinirSenha(dto.getEmail(), dto.getCodigo(), dto.getNovaSenha());
        if (ok) {
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        }
        return ResponseEntity.status(400).body("Código inválido ou expirado.");
    }
}