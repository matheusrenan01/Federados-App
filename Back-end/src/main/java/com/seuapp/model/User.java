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

    // --- CAMPOS DO CADASTRO ---
    // TEXT em vez do VARCHAR(255) padrão: o RegisterDTO permite até 500
    // caracteres aqui, e a coluna precisa acompanhar isso ou o banco trunca em silêncio.
    @Column(columnDefinition = "TEXT")
    private String descricao;

    // "discente" ou "docente" -- define quais dos campos abaixo se aplicam
    private String tipoVinculo;

    // Preenchidos quando tipoVinculo = "discente".
    // "periodo" é a ÚNICA fonte de verdade para o semestre atual do aluno --
    // tanto o Cadastro quanto o Perfil usam este mesmo campo (antes o Perfil
    // tinha seu próprio "semestre" em texto solto, duplicando o mesmo dado).
    private String curso;
    private Integer periodo;

    // Preenchidos quando tipoVinculo = "docente"
    private String departamento;
    private String siape;

    // --- FOTO DE PERFIL ---
    // Guardada como Base64 (Data URL). Funciona para um projeto acadêmico com
    // poucos usuários; numa aplicação maior o ideal é subir a imagem para um
    // storage de arquivos (S3, etc.) e guardar só a URL aqui.
    @Column(columnDefinition = "TEXT")
    private String foto;

    // --- PORTFÓLIO (um projeto em destaque no perfil) ---
    private String projetoNome;

    @Column(columnDefinition = "TEXT")
    private String projetoDescricao;

    @Column(columnDefinition = "TEXT")
    private String projetoFoto;

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
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getTipoVinculo() { return tipoVinculo; }
    public void setTipoVinculo(String tipoVinculo) { this.tipoVinculo = tipoVinculo; }

    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }

    public Integer getPeriodo() { return periodo; }
    public void setPeriodo(Integer periodo) { this.periodo = periodo; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getSiape() { return siape; }
    public void setSiape(String siape) { this.siape = siape; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public String getProjetoNome() { return projetoNome; }
    public void setProjetoNome(String projetoNome) { this.projetoNome = projetoNome; }

    public String getProjetoDescricao() { return projetoDescricao; }
    public void setProjetoDescricao(String projetoDescricao) { this.projetoDescricao = projetoDescricao; }

    public String getProjetoFoto() { return projetoFoto; }
    public void setProjetoFoto(String projetoFoto) { this.projetoFoto = projetoFoto; }

    public String getCodigoRecuperacao() { return codigoRecuperacao; }
    public void setCodigoRecuperacao(String codigoRecuperacao) { this.codigoRecuperacao = codigoRecuperacao; }

    public java.time.LocalDateTime getCodigoExpiracao() { return codigoExpiracao; }
    public void setCodigoExpiracao(java.time.LocalDateTime codigoExpiracao) { this.codigoExpiracao = codigoExpiracao; }
}
