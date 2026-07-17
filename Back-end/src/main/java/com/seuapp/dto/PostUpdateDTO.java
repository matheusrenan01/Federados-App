package com.seuapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostUpdateDTO {

    @NotBlank(message = "O texto não pode ficar vazio")
    @Size(max = 5000, message = "O texto do post é muito longo (máx. 5000 caracteres)")
    private String texto;

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
}
