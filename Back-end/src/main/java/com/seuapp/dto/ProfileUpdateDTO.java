package com.seuapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProfileUpdateDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Size(max = 500, message = "Biografia muito longa (máx. 500 caracteres)")
    private String descricao; // "Biografia" na tela de Perfil

    private String curso;
    private Integer periodo;
    private String departamento;
    private String siape;

    @Size(max = 4_000_000, message = "Imagem muito grande")
    private String foto;

    private String projetoNome;

    @Size(max = 2000, message = "Descrição do projeto muito longa")
    private String projetoDescricao;

    @Size(max = 4_000_000, message = "Imagem muito grande")
    private String projetoFoto;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
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
}
