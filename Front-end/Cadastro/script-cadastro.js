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
    
    // ===== VALIDAÇÃO DA SENHA =====
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirm_password');

    const ruleLength = document.getElementById('rule-length');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleNumber = document.getElementById('rule-number');
    const ruleMatch = document.getElementById('rule-match');
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

    // ===== VALIDAÇÃO EM TEMPO REAL =====
    senhaInput.addEventListener("input", validarSenha);
    confirmarSenhaInput.addEventListener("input", validarSenha);

    function validarSenha() {

        const senha = senhaInput.value;
        const confirmar = confirmarSenhaInput.value;

        atualizarRegra(ruleLength, senha.length >= 8);

        atualizarRegra(ruleUpper, /[A-Z]/.test(senha));

        atualizarRegra(ruleNumber, /\d/.test(senha));

        atualizarRegra(
            ruleMatch,
            confirmar !== "" && senha === confirmar
        );
    }

    function atualizarRegra(elemento, valido) {

        if (valido) {

            elemento.classList.remove("invalid");
            elemento.classList.add("valid");

        } else {

            elemento.classList.remove("valid");
            elemento.classList.add("invalid");

        }

    }
    // --- ENVIO DO FORMULÁRIO PARA O JAVA ---
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Iniciando coleta e envio dos dados...");

            const senha = document.getElementById('senha').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            const senhaValida =
                senha.length >= 8 &&
                /[A-Z]/.test(senha) &&
                /\d/.test(senha);

            if (!senhaValida) {
                alert("A senha não atende aos critérios.");
                return;
            }

            if (senha !== confirmPassword) {
                alert("As senhas digitadas não coincidem.");
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
                const resposta = await fetch(`${API_BASE_URL}/api/auth/registro`, {
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
                    const mensagem = await extrairMensagemErro(resposta);
                    alert('Erro no cadastro: ' + mensagem);
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