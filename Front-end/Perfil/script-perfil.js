document.addEventListener('DOMContentLoaded', async () => {
    const btnSave = document.getElementById('btn-save-all');
    const logoutBtn = document.getElementById('logout-btn');

    // --- PROTOCOLO DE SEGURANÇA ---
    // Antes: só olhava se existia 'usuarioLogado' no localStorage (fácil de forjar).
    // Agora: pergunta pro back-end se o token JWT é válido de verdade.
    let usuarioAutenticado = await protegerPagina();
    if (!usuarioAutenticado) return; // protegerPagina() já redirecionou

    // Função utilitária para converter arquivo em Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // --- 1. CARREGAR DADOS DO PERFIL (agora vindos do back-end, não do localStorage) ---
    function preencherTela(dados) {
        const nome = dados.nome || "";
        const curso = dados.curso || "";
        const periodo = dados.periodo || "";
        const bio = dados.descricao || "";
        const foto = dados.foto || "https://via.placeholder.com/120";

        const projNome = dados.projetoNome || "";
        const projDesc = dados.projetoDescricao || "";

        if (document.getElementById('input-name')) document.getElementById('input-name').value = nome;
        if (document.getElementById('input-course')) document.getElementById('input-course').value = curso;
        if (document.getElementById('input-semester')) document.getElementById('input-semester').value = String(periodo || "1");
        if (document.getElementById('input-bio')) document.getElementById('input-bio').value = bio;

        if (document.getElementById('input-project-name')) document.getElementById('input-project-name').value = projNome;
        if (document.getElementById('input-project-desc')) document.getElementById('input-project-desc').value = projDesc;

        if (document.getElementById('display-name')) document.getElementById('display-name').innerText = nome || "Usuário Federados";
        if (document.getElementById('display-course')) document.getElementById('display-course').innerText = curso || "Curso não informado";
        if (document.getElementById('display-semester')) document.getElementById('display-semester').innerText = periodo ? `${periodo}º Semestre` : "";
        if (document.getElementById('display-bio')) document.getElementById('display-bio').innerText = bio || "Sua biografia aparecerá aqui...";
        if (document.getElementById('display-pic')) document.getElementById('display-pic').src = foto;
    }

    preencherTela(usuarioAutenticado);

    // --- 2. SALVAR ALTERAÇÕES (agora manda pra API de verdade: PUT /api/users/me) ---
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            const novoNome = document.getElementById('input-name').value.trim();
            const novoCurso = document.getElementById('input-course').value.trim();
            const novoPeriodo = parseInt(document.getElementById('input-semester').value, 10);
            const novaBio = document.getElementById('input-bio').value.trim();
            const novoProjNome = document.getElementById('input-project-name').value.trim();
            const novoProjDesc = document.getElementById('input-project-desc').value.trim();

            if (!novoNome || !novoCurso) {
                return alert("Por favor, preencha os campos de Nome e Curso!");
            }

            const fotoFile = document.getElementById('input-file').files[0];
            const projFile = document.getElementById('input-project-file').files[0];

            try {
                // Se não escolheu uma foto nova, mantém a que já estava salva.
                const fotoBase64 = fotoFile ? await toBase64(fotoFile) : usuarioAutenticado.foto;
                const projFotoBase64 = projFile ? await toBase64(projFile) : usuarioAutenticado.projetoFoto;

                const resposta = await authFetch(`${API_BASE_URL}/api/users/me`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome: novoNome,
                        curso: novoCurso,
                        periodo: novoPeriodo,
                        descricao: novaBio,
                        foto: fotoBase64,
                        projetoNome: novoProjNome,
                        projetoDescricao: novoProjDesc,
                        projetoFoto: projFotoBase64
                    })
                });

                if (!resposta.ok) {
                    const mensagem = await extrairMensagemErro(resposta);
                    return alert("Erro ao salvar: " + mensagem);
                }

                // O back-end devolve o perfil já atualizado -- usamos a resposta
                // como nova fonte de verdade em vez de assumir que tudo deu certo.
                usuarioAutenticado = await resposta.json();
                preencherTela(usuarioAutenticado);

                alert("Todas as alterações foram salvas com sucesso!");

            } catch (error) {
                console.error("Erro ao salvar dados do perfil:", error);
                alert("Erro de conexão ao salvar o perfil.");
            }
        });
    }

    // --- 3. LOGOUT ENCERRA A SESSÃO NO CLIENTE ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout(); // definido em common/auth.js — limpa authToken + usuarioLogado
        });
    }
});
