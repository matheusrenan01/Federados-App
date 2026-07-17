package com.seuapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "A senha deve ter pelo menos 8 caracteres")
    private String senha;

    @Size(max = 500, message = "Descrição muito longa (máx. 500 caracteres)")
    private String descricao;

    // "discente" ou "docente". A obrigatoriedade condicional de curso/periodo
    // vs. departamento/siape é validada no AuthService, não aqui -- Bean
    // Validation sozinha não expressa bem "campo X obrigatório somente se Y".
    @NotBlank(message = "Informe se é discente ou docente")
    private String tipoVinculo;

    private String curso;
    private Integer periodo;
    private String departamento;
    private String siape;

    // Getters e Setters
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
}
