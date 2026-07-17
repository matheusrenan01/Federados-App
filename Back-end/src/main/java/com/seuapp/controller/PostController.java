package com.seuapp.controller;

import com.seuapp.dto.PostCreateDTO;
import com.seuapp.dto.PostResponseDTO;
import com.seuapp.dto.PostUpdateDTO;
import com.seuapp.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Sem @CrossOrigin aqui: a configuração global de CORS (SecurityConfig) já cobre
// todos os endpoints, com a lista de origens vinda de application.properties.
// Também sem permitAll: SecurityConfig já exige token válido para tudo que não é /api/auth/**.
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> listar(Authentication authentication) {
        return ResponseEntity.ok(postService.listarTodos(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<PostResponseDTO> criar(@Valid @RequestBody PostCreateDTO dto, Authentication authentication) {
        return ResponseEntity.ok(postService.criar(dto, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDTO> editar(@PathVariable Long id,
                                                    @Valid @RequestBody PostUpdateDTO dto,
                                                    Authentication authentication) {
        return ResponseEntity.ok(postService.editar(id, dto, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication authentication) {
        postService.deletar(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
