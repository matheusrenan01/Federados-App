package com.seuapp.dto;

import com.seuapp.model.Post;

import java.time.LocalDateTime;

/**
 * Monta a resposta a partir do Post + do User relacionado (autor),
 * sempre com o nome/foto ATUAIS do autor -- não uma cópia congelada
 * de quando o post foi criado (era assim que o localStorage fazia).
 */
public class PostResponseDTO {
    private Long id;
    private Long autorId;
    private String autor;
    private String autorFoto;
    private String texto;
    private String foto;
    private String arquivoConteudo;
    private String arquivoNome;
    private LocalDateTime criadoEm;
    private boolean editado;
    private boolean ehDono;

    public PostResponseDTO(Post post, String emailUsuarioLogado) {
        this.id = post.getId();
        this.autorId = post.getAutor().getId();
        this.autor = post.getAutor().getNome();
        this.autorFoto = post.getAutor().getFoto();
        this.texto = post.getTexto();
        this.foto = post.getFoto();
        this.arquivoConteudo = post.getArquivoConteudo();
        this.arquivoNome = post.getArquivoNome();
        this.criadoEm = post.getCriadoEm();
        this.editado = post.isEditado();
        this.ehDono = post.getAutor().getEmail().equals(emailUsuarioLogado);
    }

    public Long getId() { return id; }
    public Long getAutorId() { return autorId; }
    public String getAutor() { return autor; }
    public String getAutorFoto() { return autorFoto; }
    public String getTexto() { return texto; }
    public String getFoto() { return foto; }
    public String getArquivoConteudo() { return arquivoConteudo; }
    public String getArquivoNome() { return arquivoNome; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public boolean isEditado() { return editado; }
    public boolean isEhDono() { return ehDono; }
}
