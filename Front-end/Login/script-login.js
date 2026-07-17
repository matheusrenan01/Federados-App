document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('login-form');

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
                const resposta = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginDTO)
                });

                if (resposta.ok) {
                    // Agora o back-end devolve { token, usuario } em vez de um texto solto.
                    const dados = await resposta.json();

                    // CRUCIAL: guarda o token JWT — é ele que prova quem o usuário é.
                    // (usuarioLogado continua salvo só para o Feed/Perfil exibirem o e-mail;
                    // quem efetivamente autentica nas chamadas futuras à API é o token.)
                    localStorage.setItem('authToken', dados.token);
                    localStorage.setItem('usuarioLogado', emailDigitado);

                    // Redireciona o usuário para a tela principal (Feed)
                    window.location.href = "../Feed/index.html";
                } else {
                    // Trata o erro 401 (Credenciais erradas) ou bad requests
                    const mensagem = await extrairMensagemErro(resposta);
                    alert("Falha no login: " + mensagem);
                }

            } catch (error) {
                console.error("Erro ao conectar ao servidor Java:", error);
                alert("Erro: Não foi possível conectar ao servidor. Certifique-se de que a API Spring Boot está ligada na porta 8080!");
            }
        });
    }
});