package com.seuapp.controller;

import com.seuapp.dto.EsqueciSenhaDTO;
import com.seuapp.dto.LoginDTO;
import com.seuapp.dto.LoginResponseDTO;
import com.seuapp.dto.RedefinirSenhaDTO;
import com.seuapp.dto.RegisterDTO;
import com.seuapp.dto.UserResponseDTO;
import com.seuapp.dto.VerificarCodigoDTO;
import com.seuapp.model.User;
import com.seuapp.repository.UserRepository;
import com.seuapp.service.AuthService;
import com.seuapp.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@Valid @RequestBody RegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Erro: Email já cadastrado!");
        }
        User novoUsuario = authService.registrar(dto);
        // Nunca devolvemos a entidade User crua: ela carrega o hash da senha.
        return ResponseEntity.ok(new UserResponseDTO(novoUsuario));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO dto) {
        var usuario = authService.login(dto.getEmail(), dto.getSenha());

        if (usuario.isEmpty()) {
            return ResponseEntity.status(401).body("Erro nas credenciais");
        }

        User user = usuario.get();
        String token = jwtService.gerarToken(user.getEmail());

        return ResponseEntity.ok(
                new LoginResponseDTO(token, new UserResponseDTO(user))
        );
    }

    // Etapa 1: usuário digitou o email, back-end gera o código e envia por email
    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@Valid @RequestBody EsqueciSenhaDTO dto) {
        authService.gerarCodigoRecuperacao(dto.getEmail());
        // Sempre retorna sucesso, mesmo se o email não existir,
        // pra não deixar alguém descobrir quais emails estão cadastrados.
        return ResponseEntity.ok("Se o email existir, um código foi enviado.");
    }

    // Etapa 2: usuário digitou o código de 6 dígitos
    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@Valid @RequestBody VerificarCodigoDTO dto) {
        boolean valido = authService.verificarCodigo(dto.getEmail(), dto.getCodigo());
        if (valido) {
            return ResponseEntity.ok("Código válido!");
        }
        return ResponseEntity.status(400).body("Código inválido ou expirado.");
    }

    // Etapa 3: usuário digitou a nova senha
    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@Valid @RequestBody RedefinirSenhaDTO dto) {
        boolean ok = authService.redefinirSenha(dto.getEmail(), dto.getCodigo(), dto.getNovaSenha());
        if (ok) {
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        }
        return ResponseEntity.status(400).body("Código inválido ou expirado.");
    }

    // Endpoint protegido: se o token for inválido/expirado, o JwtAuthFilter nunca autentica
    // a requisição e o Spring Security barra com 401/403 antes mesmo de chegar aqui.
    // O Feed e o Perfil usam isso pra confirmar de verdade (com o back-end) que a sessão é válida.
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Não autenticado");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(new UserResponseDTO(user)))
                .orElse(ResponseEntity.status(401).body("Usuário não encontrado"));
    }
}
