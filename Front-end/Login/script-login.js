document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login'); // Altere para o ID do seu formulário no HTML

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Captura os dados digitados pelo usuário
            const emailDigitado = document.getElementById('login-email').value.trim();
            const senhaDigitada = document.getElementById('login-senha').value;

            if (!emailDigitado || !senhaDigitada) {
                return alert("Por favor, preencha todos os campos!");
            }

            // Monta o JSON exatamente como o seu LoginDTO do Java espera
            const loginDTO = {
                email: emailDigitado,
                senha: senhaDigitada
            };

            try {
                // Envia para a rota correta do seu AuthController
                const resposta = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginDTO)
                });

                const textoResposta = await resposta.text();

                if (resposta.ok) {
                    alert("Sucesso: " + textoResposta); // Exibirá "Login realizado!"
                    
                    // CRUCIAL: Salva o e-mail na sessão local para liberar e sincronizar o Feed/Perfil
                    localStorage.setItem('usuarioLogado', emailDigitado);
                    
                    // Redireciona o usuário para a tela principal (Feed)
                    window.location.href = "../Feed/index.html";
                } else {
                    // Trata o erro 401 (Credenciais erradas) ou bad requests
                    alert("Falha no login: " + textoResposta);
                }

            } catch (error) {
                console.error("Erro ao conectar ao servidor Java:", error);
                alert("Erro: Não foi possível conectar ao servidor. Certifique-se de que a API Spring Boot está ligada na porta 8080!");
            }
        });
    }
});