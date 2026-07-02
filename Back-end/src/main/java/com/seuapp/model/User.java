package com.seuapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;

    // --- CAMPOS PARA RECUPERAÇÃO DE SENHA ---
    private String codigoRecuperacao;

    private java.time.LocalDateTime codigoExpiracao;

    // Construtor vazio (obrigatório para o JPA/Hibernate)
    public User() {}

    // Construtor com os campos
    public User(String nome, String email, String senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    // --- GETTERS E SETTERS MANUAIS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; } // O método que o Java estava sentindo falta!

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getCodigoRecuperacao() { return codigoRecuperacao; }
    public void setCodigoRecuperacao(String codigoRecuperacao) { this.codigoRecuperacao = codigoRecuperacao; }

    public java.time.LocalDateTime getCodigoExpiracao() { return codigoExpiracao; }
    public void setCodigoExpiracao(java.time.LocalDateTime codigoExpiracao) { this.codigoExpiracao = codigoExpiracao; }
}