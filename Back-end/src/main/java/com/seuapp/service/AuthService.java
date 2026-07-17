package com.seuapp.service;

import com.seuapp.dto.RegisterDTO;
import com.seuapp.model.User;
import com.seuapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registrar(RegisterDTO dto) {
        validarCamposPorVinculo(dto);

        User user = new User();
        user.setNome(dto.getNome());
        user.setEmail(dto.getEmail());
        // Nunca gravamos a senha em texto puro -- gravamos o hash.
        user.setSenha(passwordEncoder.encode(dto.getSenha()));
        user.setDescricao(dto.getDescricao());
        user.setTipoVinculo(dto.getTipoVinculo());

        if ("discente".equalsIgnoreCase(dto.getTipoVinculo())) {
            user.setCurso(dto.getCurso());
            user.setPeriodo(dto.getPeriodo());
        } else {
            user.setDepartamento(dto.getDepartamento());
            user.setSiape(dto.getSiape());
        }

        return userRepository.save(user);
    }

    // Regra condicional que o @NotBlank/@Size do DTO sozinho não cobre:
    // "curso e período são obrigatórios SE for discente", etc.
    // Lançar aqui é capturado pelo GlobalExceptionHandler e vira 400 com mensagem clara.
    private void validarCamposPorVinculo(RegisterDTO dto) {
        String tipo = dto.getTipoVinculo();

        if ("discente".equalsIgnoreCase(tipo)) {
            if (dto.getCurso() == null || dto.getCurso().isBlank()) {
                throw new IllegalArgumentException("Curso é obrigatório para discentes.");
            }
            if (dto.getPeriodo() == null) {
                throw new IllegalArgumentException("Período é obrigatório para discentes.");
            }
        } else if ("docente".equalsIgnoreCase(tipo)) {
            if (dto.getDepartamento() == null || dto.getDepartamento().isBlank()) {
                throw new IllegalArgumentException("Departamento é obrigatório para docentes.");
            }
            if (dto.getSiape() == null || dto.getSiape().isBlank()) {
                throw new IllegalArgumentException("SIAPE é obrigatório para docentes.");
            }
        } else {
            throw new IllegalArgumentException("tipoVinculo deve ser 'discente' ou 'docente'.");
        }
    }

    public Optional<User> login(String email, String senha) {
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(senha, u.getSenha()));
    }

    // --- RECUPERAÇÃO DE SENHA ---

    // Etapa 1: gera o código, salva no usuário e dispara o email
    public boolean gerarCodigoRecuperacao(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Não revelamos se o email existe ou não, por segurança
            return false;
        }

        User user = userOpt.get();
        // SecureRandom em vez de Random: o código de recuperação de senha
        // é um segredo de curta duração e precisa ser imprevisível.
        String codigo = String.format("%06d", RANDOM.nextInt(1_000_000));

        user.setCodigoRecuperacao(codigo);
        user.setCodigoExpiracao(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.enviarCodigoRecuperacao(email, codigo);
        return true;
    }

    // Etapa 2: apenas confere se o código bate e não expirou
    public boolean verificarCodigo(String email, String codigo) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        if (user.getCodigoRecuperacao() == null || user.getCodigoExpiracao() == null) return false;
        if (LocalDateTime.now().isAfter(user.getCodigoExpiracao())) return false;

        return user.getCodigoRecuperacao().equals(codigo);
    }

    // Etapa 3: confere o código de novo (nunca confie só no que o front-end diz) e troca a senha
    public boolean redefinirSenha(String email, String codigo, String novaSenha) {
        if (!verificarCodigo(email, codigo)) return false;

        User user = userRepository.findByEmail(email).get();
        user.setSenha(passwordEncoder.encode(novaSenha));

        // invalida o código pra não poder ser reusado
        user.setCodigoRecuperacao(null);
        user.setCodigoExpiracao(null);

        userRepository.save(user);
        return true;
    }
}
