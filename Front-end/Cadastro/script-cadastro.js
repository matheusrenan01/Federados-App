const formCadastro = document.getElementById('form-cadastro');
const senhaInput = document.getElementById('senha');
const confirmPasswordInput = document.getElementById('confirm_password');

// Elementos de texto de validação do HTML
const ruleLength = document.getElementById('rule-length');
const ruleUpper = document.getElementById('rule-upper');
const ruleNumber = document.getElementById('rule-number');
const ruleMatch = document.getElementById('rule-match');

//  VALIDAÇÃO EM TEMPO REAL DA SENHA 
senhaInput.addEventListener('input', () => {
    const valorSenha = senhaInput.value;

    // 1. Verifica se tem pelo menos 8 dígitos
    if (valorSenha.length >= 8) {
        ruleLength.classList.remove('invalid');
        ruleLength.classList.add('valid');
    } else {
        ruleLength.classList.remove('valid');
        ruleLength.classList.add('invalid');
    }

    // 2. Verifica se tem pelo menos uma letra maiúscula
    if (/[A-Z]/.test(valorSenha)) {
        ruleUpper.classList.remove('invalid');
        ruleUpper.classList.add('valid');
    } else {
        ruleUpper.classList.remove('valid');
        ruleUpper.classList.add('invalid');
    }

    // 3. Verifica se tem pelo menos um número
    if (/[0-9]/.test(valorSenha)) {
        ruleNumber.classList.remove('invalid');
        ruleNumber.classList.add('valid');
    } else {
        ruleNumber.classList.remove('valid');
        ruleNumber.classList.add('invalid');
    }
    
    // Atualiza a validação de igualdade caso o usuário mexa na primeira senha
    validarIgualdade();
});

// VALIDAÇÃO EM TEMPO REAL DA REPETIÇÃO 
confirmPasswordInput.addEventListener('input', validarIgualdade);

function validarIgualdade() {
    const valorSenha = senhaInput.value;
    const valorConfirmar = confirmPasswordInput.value;

    // Se o campo estiver vazio, mantém como inválido
    if (valorConfirmar === "") {
        ruleMatch.classList.remove('valid');
        ruleMatch.classList.add('invalid');
        return;
    }

    // Verifica se são exatamente iguais
    if (valorSenha === valorConfirmar) {
        ruleMatch.classList.remove('invalid');
        ruleMatch.classList.add('valid');
    } else {
        ruleMatch.classList.remove('valid');
        ruleMatch.classList.add('invalid');
    }
}

// --- ENVIO DO FORMULÁRIO ---
formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede a página de recarregar
    console.log("Botão de cadastro clicado! Coletando dados...");

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = senhaInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Trava de segurança: impede o envio se alguma regra ainda estiver marcada como inválida
    const temErroGeral = ruleLength.classList.contains('invalid') || 
                         ruleUpper.classList.contains('invalid') || 
                         ruleNumber.classList.contains('invalid') || 
                         ruleMatch.classList.contains('invalid');

    if (temErroGeral) {
        alert("As senhas não cumprem todos os requisitos ou não coincidem! Verifique e tente novamente.");
        return; 
    }

    const dadosUsuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    console.log("Enviando para o Java: ", dadosUsuario);

    try {
        const resposta = await fetch('http://localhost:8080/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (resposta.ok) {
            
            // --- ADICIONADO: Salva o nome no navegador para o Feed usar depois ---
            localStorage.setItem('usuarioNome', nome);
            
            alert('Cadastro realizado com sucesso!');
            // Caminho relativo para a pasta de Login (sobe uma pasta com ../ e entra em Login)
            window.location.href = '../Login/index.html'; 
        } else {
            const erroBackend = await resposta.text();
            alert('Erro no cadastro: ' + erroBackend);
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro de conexão. Verifique se o BackendApplication (Java) está rodando.');
    }
});

// FUNÇÃO DO OLHINHO 
function togglePass(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}