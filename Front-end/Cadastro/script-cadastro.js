const formCadastro = document.querySelector('form');

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede a página de recarregar
    console.log("Botão de cadastro clicado! Coletando dados...");

    // Puxa os valores usando os IDs que colocamos no HTML
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    // --- ADICIONADO: Puxa o valor da repetição de senha ---
    const confirmPassword = document.getElementById('confirm_password').value;

    // --- ADICIONADO: Trava o envio se as senhas digitadas forem diferentes ---
    if (senha !== confirmPassword) {
        alert("As senhas digitadas não coincidem! Verifique e tente novamente.");
        return; // Faz o código parar aqui e não envia pro Java
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
            alert('Cadastro realizado com sucesso!');
            // Redireciona para a página de Login
            window.location.href = '\Federados-App-main\Front-end\Login\index.html'; 
        } else {
            const erroBackend = await resposta.text();
            alert('Erro no cadastro: ' + erroBackend);
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro de conexão. Verifique se o BackendApplication (Java) está rodando.');
    }
});

// --- ADICIONADO: Função para o olhinho da senha funcionar ---
function togglePass(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}