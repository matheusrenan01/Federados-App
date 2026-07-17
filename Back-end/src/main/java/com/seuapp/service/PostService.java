package com.seuapp.service;

import com.seuapp.dto.PostCreateDTO;
import com.seuapp.dto.PostResponseDTO;
import com.seuapp.dto.PostUpdateDTO;
import com.seuapp.model.Post;
import com.seuapp.model.User;
import com.seuapp.repository.PostRepository;
import com.seuapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PostResponseDTO> listarTodos(String emailUsuarioLogado) {
        return postRepository.findAllByOrderByCriadoEmDesc()
                .stream()
                .map(post -> new PostResponseDTO(post, emailUsuarioLogado))
                .toList();
    }

    public PostResponseDTO criar(PostCreateDTO dto, String emailAutor) {
        if ((dto.getTexto() == null || dto.getTexto().isBlank())
                && (dto.getFoto() == null || dto.getFoto().isBlank())
                && (dto.getArquivoConteudo() == null || dto.getArquivoConteudo().isBlank())) {
            throw new IllegalArgumentException("Escreva algo ou anexe uma foto/arquivo.");
        }

        User autor = buscarUsuario(emailAutor);

        Post post = new Post();
        post.setAutor(autor);
        post.setTexto(dto.getTexto());
        post.setFoto(dto.getFoto());
        post.setArquivoConteudo(dto.getArquivoConteudo());
        post.setArquivoNome(dto.getArquivoNome());
        post.setCriadoEm(LocalDateTime.now());

        Post salvo = postRepository.save(post);
        return new PostResponseDTO(salvo, emailAutor);
    }

    public PostResponseDTO editar(Long postId, PostUpdateDTO dto, String emailUsuarioLogado) {
        Post post = buscarPost(postId);
        garantirQueEhDono(post, emailUsuarioLogado);

        post.setTexto(dto.getTexto());
        post.setEditado(true);

        Post salvo = postRepository.save(post);
        return new PostResponseDTO(salvo, emailUsuarioLogado);
    }

    public void deletar(Long postId, String emailUsuarioLogado) {
        Post post = buscarPost(postId);
        garantirQueEhDono(post, emailUsuarioLogado);
        postRepository.delete(post);
    }

    private void garantirQueEhDono(Post post, String emailUsuarioLogado) {
        if (!post.getAutor().getEmail().equals(emailUsuarioLogado)) {
            // Antes, essa checagem só existia no JavaScript do navegador --
            // qualquer chamada direta à API conseguia editar/excluir posts de outra pessoa.
            throw new AccessDeniedException("Você não tem permissão para alterar esta publicação.");
        }
    }

    private Post buscarPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post não encontrado."));
    }

    private User buscarUsuario(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }
}
