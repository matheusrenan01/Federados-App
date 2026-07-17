// common/auth.js
// Centraliza tudo que depende do JWT: checar se a sessão é válida de verdade
// (perguntando ao back-end, não só olhando se existe algo no localStorage),
// anexar o token nas chamadas à API, e fazer logout limpando tudo.

const API_BASE_URL = "http://localhost:8080";

/**
 * Roda no início de páginas protegidas (Feed, Perfil...).
 * Antes, a "proteção" só checava se `usuarioLogado` existia no localStorage —
 * qualquer um podia forjar isso pelo console do navegador. Agora perguntamos
 * pro back-end se o token ainda é válido antes de liberar a página.
 *
 * Retorna os dados do usuário autenticado (vindos do back-end) se tudo certo,
 * ou redireciona para o login e retorna null.
 */
async function protegerPagina() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        redirecionarParaLogin("Você não está logado.");
        return null;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!resposta.ok) {
            // Token expirado, inválido, ou usuário não existe mais
            redirecionarParaLogin("Sua sessão expirou. Faça login novamente.");
            return null;
        }

        return await resposta.json(); // { id, nome, email }
    } catch (erro) {
        console.error("Não foi possível validar a sessão com o servidor:", erro);
        redirecionarParaLogin("Não foi possível confirmar sua sessão. Faça login novamente.");
        return null;
    }
}

/**
 * O back-end agora pode responder erro tanto como texto puro (endpoints antigos,
 * ex: "Email já cadastrado") quanto como JSON (erros de validação, formato
 * { "erro": "...", "campos": {...} } vindo do GlobalExceptionHandler).
 * Esta função tenta as duas formas e sempre devolve uma string legível.
 */
async function extrairMensagemErro(resposta) {
    const bruto = await resposta.text();
    try {
        const json = JSON.parse(bruto);
        if (json.campos) {
            return Object.values(json.campos).join("\n");
        }
        return json.erro || bruto;
    } catch {
        return bruto; // não era JSON, era mesmo texto puro
    }
}

function redirecionarParaLogin(mensagem) {
    limparSessao();
    alert(mensagem);
    // Este arquivo é usado a partir de Front-end/Feed/ e Front-end/Perfil/,
    // ambas um nível abaixo de Front-end/ — o caminho relativo funciona para as duas.
    window.location.href = "../Login/index.html";
}

function limparSessao() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuarioLogado');
}

/**
 * Wrapper de fetch que já manda o token no header Authorization.
 * Usar essa função (em vez de fetch puro) em qualquer chamada futura
 * a endpoints protegidos da API (ex: publicar um post de verdade).
 */
async function authFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`
    };
    return fetch(url, { ...options, headers });
}

/**
 * Logout centralizado: limpa o token JWT junto com o e-mail salvo.
 * (No código anterior, o logout só removia 'usuarioLogado' e o token
 * ficava esquecido no localStorage.)
 */
function logout() {
    if (confirm("Deseja realmente sair do Federados?")) {
        limparSessao();
        alert("Você saiu do sistema de forma segura.");
        window.location.href = "../Login/index.html";
    }
}
