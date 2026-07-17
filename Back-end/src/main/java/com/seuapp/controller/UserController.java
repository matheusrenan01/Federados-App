package com.seuapp.controller;

import com.seuapp.dto.ProfileUpdateDTO;
import com.seuapp.dto.UserResponseDTO;
import com.seuapp.model.User;
import com.seuapp.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Antes: o botão "Salvar" do Perfil só gravava no localStorage do navegador
    // (sob chaves como `nome_${email}`) -- nada ia pro back-end de verdade,
    // então o perfil "resetava" em qualquer outro navegador/dispositivo.
    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> atualizarPerfil(@Valid @RequestBody ProfileUpdateDTO dto,
                                                             Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        user.setNome(dto.getNome());
        user.setDescricao(dto.getDescricao());
        user.setFoto(dto.getFoto());
        user.setProjetoNome(dto.getProjetoNome());
        user.setProjetoDescricao(dto.getProjetoDescricao());
        user.setProjetoFoto(dto.getProjetoFoto());

        // Curso/período só fazem sentido pra discente; departamento/SIAPE só pra docente.
        // Checamos null em vez de sobrescrever sempre: a tela de Perfil hoje só tem
        // campos de discente (curso/semestre) -- sem essa checagem, um docente
        // perderia departamento/SIAPE ao salvar o próprio perfil.
        if ("discente".equalsIgnoreCase(user.getTipoVinculo())) {
            if (dto.getCurso() != null) user.setCurso(dto.getCurso());
            if (dto.getPeriodo() != null) user.setPeriodo(dto.getPeriodo());
        } else if ("docente".equalsIgnoreCase(user.getTipoVinculo())) {
            if (dto.getDepartamento() != null) user.setDepartamento(dto.getDepartamento());
            if (dto.getSiape() != null) user.setSiape(dto.getSiape());
        }

        User salvo = userRepository.save(user);
        return ResponseEntity.ok(new UserResponseDTO(salvo));
    }
}
