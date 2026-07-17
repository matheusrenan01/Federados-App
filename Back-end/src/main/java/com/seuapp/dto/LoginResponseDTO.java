package com.seuapp.dto;

public class LoginResponseDTO {
    private String token;
    private UserResponseDTO usuario;

    public LoginResponseDTO(String token, UserResponseDTO usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    public String getToken() { return token; }
    public UserResponseDTO getUsuario() { return usuario; }
}
