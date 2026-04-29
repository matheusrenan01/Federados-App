const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm_password');

// Elementos das regras
const rules = {
    length: document.getElementById('rule-length'),
    upper: document.getElementById('rule-upper'),
    number: document.getElementById('rule-number'),
    match: document.getElementById('rule-match')
};

// Função para mostrar/esconder senha
function togglePass(inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = input.nextElementSibling;
    if (input.type === "password") {
        input.type = "text";
        eyeIcon.textContent = "—";
    } else {
        input.type = "password";
        eyeIcon.textContent = "👁️";
    }
}

// Função de validação
function validate() {
    const val = passwordInput.value;
    const confVal = confirmInput.value;

    // Tamanho
    const isLongEnough = val.length >= 8;
    rules.length.className = isLongEnough ? 'valid' : 'invalid';

    // Maiúscula
    const hasUpper = /[A-Z]/.test(val);
    rules.upper.className = hasUpper ? 'valid' : 'invalid';

    // Número
    const hasNumber = /[0-9]/.test(val);
    rules.number.className = hasNumber ? 'valid' : 'invalid';

    // Iguais
    const isMatch = val === confVal && val !== "";
    rules.match.className = isMatch ? 'valid' : 'invalid';
}

passwordInput.addEventListener('input', validate);
confirmInput.addEventListener('input', validate);