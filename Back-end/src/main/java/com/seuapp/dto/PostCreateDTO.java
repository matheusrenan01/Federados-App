package com.seuapp.dto;

import jakarta.validation.constraints.Size;

public class PostCreateDTO {

    @Size(max = 5000, message = "O texto do post é muito longo (máx. 5000 caracteres)")
    private String texto;

    // Base64. Limite generoso mas não infinito -- sem isso, qualquer um
    // poderia mandar payloads gigantes e inchar o banco SQLite sem controle.
    @Size(max = 4_000_000, message = "Imagem muito grande")
    private String foto;

    @Size(max = 4_000_000, message = "Arquivo muito grande")
    private String arquivoConteudo;

    private String arquivoNome;

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getArquivoConteudo() { return arquivoConteudo; }
    public void setArquivoConteudo(String arquivoConteudo) { this.arquivoConteudo = arquivoConteudo; }
    public String getArquivoNome() { return arquivoNome; }
    public void setArquivoNome(String arquivoNome) { this.arquivoNome = arquivoNome; }
}
