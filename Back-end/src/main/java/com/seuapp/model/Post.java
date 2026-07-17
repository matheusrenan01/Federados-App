package com.seuapp.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Antes, "posts" eram só um array no localStorage do navegador -- não
 * existiam pro back-end, não eram compartilhados entre usuários de verdade
 * (cada navegador tinha sua própria cópia "fake" da rede social) e sumiam
 * se o usuário limpasse os dados do site. Agora é uma entidade real.
 */
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quem escreveu o post. Buscamos nome/foto do autor a partir daqui na
    // hora de exibir -- assim, se o usuário trocar de foto, os posts antigos
    // já mostram a foto nova (em vez de congelar uma cópia desatualizada).
    // EAGER (não LAZY): montamos o PostResponseDTO fora do escopo transacional
    // do repositório, então uma relação LAZY lançaria LazyInitializationException
    // ao tentar ler autor.getNome()/getFoto(). Numa app com poucos posts como
    // esta, o custo do EAGER é irrelevante; a alternativa "correta" seria
    // @Transactional no PostService, mas isso é mais peso do que o projeto precisa agora.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "autor_id", nullable = false)
    private User autor;

    @Column(columnDefinition = "TEXT")
    private String texto;

    // Anexos opcionais, também em Base64 (mesma lógica/limitação da foto de perfil)
    @Column(columnDefinition = "TEXT")
    private String foto;

    @Column(columnDefinition = "TEXT")
    private String arquivoConteudo;

    private String arquivoNome;

    private LocalDateTime criadoEm;

    private boolean editado = false;

    public Post() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getAutor() { return autor; }
    public void setAutor(User autor) { this.autor = autor; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public String getArquivoConteudo() { return arquivoConteudo; }
    public void setArquivoConteudo(String arquivoConteudo) { this.arquivoConteudo = arquivoConteudo; }

    public String getArquivoNome() { return arquivoNome; }
    public void setArquivoNome(String arquivoNome) { this.arquivoNome = arquivoNome; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public boolean isEditado() { return editado; }
    public void setEditado(boolean editado) { this.editado = editado; }
}
