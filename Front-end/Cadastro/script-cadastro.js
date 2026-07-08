document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('form-cadastro');
    const tipoUsuario = document.getElementById('tipo-usuario');
    const btnVoltar = document.getElementById('btn-voltar');

    // Mapeamento dos blocos de campos
    const rowDiscente = document.getElementById('row-discente');
    const rowDocente = document.getElementById('row-docente');

    // Elementos de entrada para controle dinâmico
    const inputCurso = document.getElementById('curso');
    const inputPeriodo = document.getElementById('periodo');
    const inputDepartamento = document.getElementById('departamento');
    const inputSiape = document.getElementById('siape');

    // --- LÓGICA DE ALTERNÂNCIA DE ABAS (DISCENTE / DOCENTE) ---
    if (tipoUsuario) {
        tipoUsuario.addEventListener('change', function() {
            if (this.value === 'docente') {
                // Exibe bloco docente e esconde discente
                rowDiscente.style.display = 'none';
                rowDocente.style.display = 'flex';

                // Altera obrigatoriedade dos campos
                inputCurso.required = false;
                inputPeriodo.required = false;
                inputDepartamento.required = true;
                inputSiape.required = true;
            } else {
                // Exibe bloco discente e esconde docente
                rowDiscente.style.display = 'flex';
                rowDocente.style.display = 'none';

                // Altera obrigatoriedade dos campos
                inputCurso.required = true;
                inputPeriodo.required = true;
                inputDepartamento.required = false;
                inputSiape.required = false;
            }
        });
    }

    // --- FUNCIONALIDADE DO BOTÃO VOLTAR ---
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            window.location.href = '../Login/index.html';
        });
    }

    // --- ENVIO DO FORMULÁRIO PARA O JAVA ---
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Iniciando coleta e envio dos dados...");

            const senha = document.getElementById('senha').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            if (senha !== confirmPassword) {
                alert("As senhas digitadas não coincidem! Verifique e tente novamente.");
                return;
            }

            // Coleta dados comuns (Removido acento de tipoVinculo para compatibilidade estrita do DTO)
            const dadosUsuario = {
                nome: document.getElementById('nome').value.trim(),
                email: document.getElementById('email').value.trim(),
                descricao: document.getElementById('descricao').value.trim(),
                senha: senha,
                tipoVinculo: tipoUsuario.value // Mapeado sem acento para o padrão do Java
            };

            // Insere dados específicos conforme a escolha da aba
            if (tipoUsuario.value === 'discente') {
                dadosUsuario.curso = inputCurso.value.trim();
                dadosUsuario.periodo = parseInt(inputPeriodo.value, 10);
                dadosUsuario.departamento = null;
                dadosUsuario.siape = null;
            } else {
                dadosUsuario.curso = null;
                dadosUsuario.periodo = null;
                dadosUsuario.departamento = inputDepartamento.value.trim();
                dadosUsuario.siape = inputSiape.value.trim();
            }

            console.log("Payload enviado para o Spring Boot: ", dadosUsuario);

            try {
                const resposta = await fetch('http://localhost:8080/api/auth/registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosUsuario)
                });

                if (resposta.ok) {
                    alert('Cadastro realizado com sucesso!');
                    window.location.href = '../Login/index.html'; 
                } else {
                    const erroBackend = await resposta.text();
                    alert('Erro no cadastro: ' + erroBackend);
                }
            } catch (erro) {
                console.error('Erro:', erro);
                alert('Erro de conexão. Certifique-se de que sua API Java está ativa na porta 8080.');
            }
        });
    }
});

// Função para o ícone de olho
function togglePass(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.type = field.type === "password" ? "text" : "password";
    }
}