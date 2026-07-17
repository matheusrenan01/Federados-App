// API_BASE_URL vem de common/auth.js -- uma única constante para o endereço
// do back-end em todo o front-end, em vez de cada tela ter a sua própria cópia.
const API_URL = `${API_BASE_URL}/api/auth`;

let countdown; // Variável para controlar o cronômetro
let emailDigitado = ''; // Guardamos o email entre as etapas

// --- ETAPA 1: pedir o código ---
async function nextStep() {
    const emailInput = document.getElementById('email-input').value.trim();
    if (!emailInput) return alert("Por favor, digite seu email.");

    const btnAvancar = document.getElementById('btn-step-1');
    btnAvancar.innerText = "Enviando...";
    btnAvancar.disabled = true;

    try {
        const resposta = await fetch(`${API_URL}/esqueci-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput })
        });

        if (resposta.ok) {
            emailDigitado = emailInput;
            alert("Se o email existir, um código foi enviado!");

            document.getElementById('step-1').style.display = 'none';
            document.getElementById('step-2').style.display = 'block';

            iniciarCronometro();
        } else {
            const erro = await resposta.text();
            alert('Erro: ' + erro);
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro de conexão. Verifique se o BackendApplication (Java) está rodando.');
    } finally {
        btnAvancar.innerText = "Avançar";
        btnAvancar.disabled = false;
    }
}

function iniciarCronometro() {
    let tempoRestante = 300; // 5 minutos
    const timerElement = document.getElementById('timer');

    if (countdown) clearInterval(countdown);

    countdown = setInterval(() => {
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        timerElement.innerText = `Expira em: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

        if (tempoRestante <= 0) {
            clearInterval(countdown);
            timerElement.innerText = "Código expirado!";
        }
        tempoRestante--;
    }, 1000);
}

function prevStep() {
    clearInterval(countdown);
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-1').style.display = 'block';
}

// --- ETAPA 2: verificar o código junto ao back-end ---
async function verificarCodigo() {
    const inputs = document.querySelectorAll('.code-input');
    const codigoDigitado = Array.from(inputs).map(i => i.value).join('');

    if (codigoDigitado.length !== 6) {
        return alert("Digite os 6 dígitos do código.");
    }

    const btnAvancar = document.getElementById('btn-step-2');
    btnAvancar.innerText = "Verificando...";
    btnAvancar.disabled = true;

    try {
        const resposta = await fetch(`${API_URL}/verificar-codigo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailDigitado, codigo: codigoDigitado })
        });

        if (resposta.ok) {
            clearInterval(countdown);
            document.getElementById('step-2').style.display = 'none';
            document.getElementById('step-3').style.display = 'block';
            iniciarValidacaoSenha();
        } else {
            const erro = await resposta.text();
            alert(erro || "Código incorreto ou expirado.");
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro de conexão. Verifique se o BackendApplication (Java) está rodando.');
    } finally {
        btnAvancar.innerText = "Avançar";
        btnAvancar.disabled = false;
    }
}

function prevStepFrom3() {
    document.getElementById('step-3').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
    iniciarCronometro();
}

// --- ETAPA 3: validação de senha (mesmas regras do cadastro) e envio da nova senha ---
let novaSenhaInput;
let confirmarNovaSenhaInput;

let ruleLength;
let ruleUpper;
let ruleNumber;
let ruleMatch;

function iniciarValidacaoSenha() {

    novaSenhaInput = document.getElementById('nova-senha');
    confirmarNovaSenhaInput = document.getElementById('confirmar-nova-senha');

    ruleLength = document.getElementById('rule-length');
    ruleUpper = document.getElementById('rule-upper');
    ruleNumber = document.getElementById('rule-number');
    ruleMatch = document.getElementById('rule-match');

    novaSenhaInput.addEventListener("input", validarSenha);
    confirmarNovaSenhaInput.addEventListener("input", validarSenha);

}

if (novaSenhaInput && confirmarNovaSenhaInput) {

    novaSenhaInput.addEventListener('input', () => {

        const valorSenha = novaSenhaInput.value;

        if (valorSenha.length >= 8) {
            ruleLength.classList.remove('invalid');
            ruleLength.classList.add('valid');
        } else {
            ruleLength.classList.remove('valid');
            ruleLength.classList.add('invalid');
        }

        if (/[A-Z]/.test(valorSenha)) {
            ruleUpper.classList.remove('invalid');
            ruleUpper.classList.add('valid');
        } else {
            ruleUpper.classList.remove('valid');
            ruleUpper.classList.add('invalid');
        }

        if (/[0-9]/.test(valorSenha)) {
            ruleNumber.classList.remove('invalid');
            ruleNumber.classList.add('valid');
        } else {
            ruleNumber.classList.remove('valid');
            ruleNumber.classList.add('invalid');
        }

        validarIgualdade();

    });

    confirmarNovaSenhaInput.addEventListener('input', validarIgualdade);
}
function validarSenha() {

    const senha = novaSenhaInput.value;
    const confirmar = confirmarNovaSenhaInput.value;

    atualizarRegra(ruleLength, senha.length >= 8);

    atualizarRegra(ruleUpper, /[A-Z]/.test(senha));

    atualizarRegra(ruleNumber, /\d/.test(senha));

    atualizarRegra(ruleMatch,
        confirmar !== "" &&
        senha === confirmar);

}

function atualizarRegra(regra, valido){

    if(valido){

        regra.classList.remove("invalid");
        regra.classList.add("valid");

    }else{

        regra.classList.remove("valid");
        regra.classList.add("invalid");

    }

}
async function redefinirSenha() {
    const inputs = document.querySelectorAll('.code-input');
    const codigoDigitado = Array.from(inputs).map(i => i.value).join('');

    const temErroGeral = ruleLength.classList.contains('invalid') ||
                         ruleUpper.classList.contains('invalid') ||
                         ruleNumber.classList.contains('invalid') ||
                         ruleMatch.classList.contains('invalid');

    if (temErroGeral) {
        alert("A nova senha não cumpre todos os requisitos ou não coincide! Verifique e tente novamente.");
        return;
    }

    const btnRedefinir = document.getElementById('btn-step-3');
    btnRedefinir.innerText = "Salvando...";
    btnRedefinir.disabled = true;

    try {
        const resposta = await fetch(`${API_URL}/redefinir-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailDigitado,
                codigo: codigoDigitado,
                novaSenha: novaSenhaInput.value
            })
        });

        if (resposta.ok) {
            alert("Senha redefinida com sucesso! Faça login com a nova senha.");
            window.location.href = '../Login/index.html';
        } else {
            const erro = await resposta.text();
            alert(erro || "Não foi possível redefinir a senha. O código pode ter expirado.");
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro de conexão. Verifique se o BackendApplication (Java) está rodando.');
    } finally {
        btnRedefinir.innerText = "Redefinir senha";
        btnRedefinir.disabled = false;
    }
}

// FUNÇÃO DO OLHINHO (mesma do cadastro)
function togglePass(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}

// Lógica de pulo entre inputs do código (mantida igual)
const codeInputs = document.querySelectorAll('.code-input');
codeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < codeInputs.length - 1) codeInputs[index + 1].focus();
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) codeInputs[index - 1].focus();
    });
});
