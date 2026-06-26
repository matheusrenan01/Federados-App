// Troca para a tela do código
function nextStep() {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

// Volta para a tela do email
function prevStep() {
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-1').style.display = 'block';
}

function finalizar() {
    alert("Código validado! Agora você seria redirecionado para criar a nova senha.");
}

// Lógica para pular os campos de código automaticamente
const inputs = document.querySelectorAll('.code-input');

inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus(); // Pula para o próximo
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
            inputs[index - 1].focus(); // Volta se apagar
        }
    });
});