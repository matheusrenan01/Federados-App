package com.seuapp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Centraliza o tratamento de erros da API.
 * Antes, cada controller devolvia texto solto e em formato diferente
 * (ResponseEntity.badRequest().body("string")). Agora todo erro tem o
 * mesmo formato: { "erro": "...", "campos": {...opcional...} }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Disparado quando um DTO com @Valid falha nas anotações (@NotBlank, @Email, @Size...).
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new HashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            campos.put(erro.getField(), erro.getDefaultMessage());
        }

        Map<String, Object> corpo = new HashMap<>();
        corpo.put("erro", "Dados inválidos");
        corpo.put("campos", campos);

        return ResponseEntity.badRequest().body(corpo);
    }

    // Regras de negócio explícitas (ex: "curso é obrigatório para discentes")
    // lançadas como IllegalArgumentException nos services.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleArgumentoInvalido(IllegalArgumentException ex) {
        Map<String, Object> corpo = new HashMap<>();
        corpo.put("erro", ex.getMessage());
        return ResponseEntity.badRequest().body(corpo);
    }

    // Tentativa de editar/excluir algo que não é seu (ex: post de outra pessoa).
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAcessoNegado(AccessDeniedException ex) {
        Map<String, Object> corpo = new HashMap<>();
        corpo.put("erro", ex.getMessage());
        return ResponseEntity.status(403).body(corpo);
    }

    // Rede de segurança: qualquer outra exceção não tratada não deve vazar
    // stack trace nem detalhes internos pro cliente.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenerico(Exception ex) {
        log.error("Erro não tratado", ex);
        Map<String, Object> corpo = new HashMap<>();
        corpo.put("erro", "Ocorreu um erro inesperado no servidor.");
        return ResponseEntity.internalServerError().body(corpo);
    }
}
