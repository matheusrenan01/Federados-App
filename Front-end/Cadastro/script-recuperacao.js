emailjs.init("zxDx7KjQd35ABa2Ke");

let countdown; // Variável para controlar o cronômetro

async function nextStep() {
    const emailInput = document.getElementById('email-input').value;
    if (!emailInput) return alert("Por favor, digite seu email.");

    const codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calcula a hora de expiração (para o e-mail)
    const dataExpiracao = new Date(Date.now() + 5 * 60 * 1000);
    const horaExpiracao = dataExpiracao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    sessionStorage.setItem('codigoRecuperacao', codigoGerado);
    sessionStorage.setItem('tempoExpiracao', Date.now() + 5 * 60 * 1000); 

    const templateParams = {
        email_destino: emailInput,
        time: horaExpiracao, 
        passcode: codigoGerado 
    };

    try {
        const btnAvancar = document.querySelector('#step-1 .btn-pill');
        btnAvancar.innerText = "Enviando...";
        btnAvancar.disabled = true;

        await emailjs.send("service_mo0wryn", "template_07icx57", templateParams);
        
        alert("Código enviado!");
        
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
        
        iniciarCronometro(); // Inicia o contador na tela

        btnAvancar.innerText = "Avançar";
        btnAvancar.disabled = false;
    } catch (erro) {
        alert("Erro ao enviar. Tente novamente.");
    }
}

function iniciarCronometro() {
    let tempoRestante = 300; // 5 minutos
    const timerElement = document.getElementById('timer');
    
    // Limpa cronômetro anterior se existir
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
    clearInterval(countdown); // Para o contador se voltar
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-1').style.display = 'block';
}

function finalizar() {
    const inputs = document.querySelectorAll('.code-input');
    let codigoDigitado = Array.from(inputs).map(i => i.value).join('');

    if (Date.now() > parseInt(sessionStorage.getItem('tempoExpiracao'))) {
        alert("O tempo expirou!");
        return;
    }

    if (codigoDigitado === sessionStorage.getItem('codigoRecuperacao')) {
        alert("Código validado! Redirecionando...");
    } else {
        alert("Código incorreto.");
    }
}

// Lógica de pulo entre inputs (mantida igual)
const inputs = document.querySelectorAll('.code-input');
inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) inputs[index - 1].focus();
    });
});