document.addEventListener('DOMContentLoaded', () => {
    const btnSave = document.getElementById('btn-save-all');
    const logoutBtn = document.getElementById('logout-btn');
    
    // --- PROTOCOLO DE SEGURANÇA (CORREÇÃO BUG 5) ---
    // Verifica se o usuário realmente está logado ao carregar a página
    const usuarioLogadoEmail = localStorage.getItem('usuarioLogado'); // Ex: "aluno@institucional.com"
    
    if (!usuarioLogadoEmail) {
        alert("Sua sessão expirou ou você não está logado. Redirecionando...");
        window.location.href = "../Login/index.html";
        return; // Para a execução do script
    }

    // Função utilitária para converter arquivo em Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // --- 1. CARREGAR DADOS SALVOS INDIVIDUAIS (CORREÇÃO BUGS 1, 2, 3 e 4) ---
    function carregarDados() {
        // Criamos chaves únicas baseadas no e-mail do usuário logado
        const nome = localStorage.getItem(`nome_${usuarioLogadoEmail}`) || "Usuário Federados";
        const curso = localStorage.getItem(`curso_${usuarioLogadoEmail}`) || "Engenharia da Computação";
        const semestre = localStorage.getItem(`semestre_${usuarioLogadoEmail}`) || "1º Semestre";
        const bio = localStorage.getItem(`bio_${usuarioLogadoEmail}`) || "Sua biografia aparecerá aqui...";
        const foto = localStorage.getItem(`foto_${usuarioLogadoEmail}`) || "https://via.placeholder.com/120";

        // Dados do Portfólio (Resolução do Bug 1 - Placeholder)
        const projNome = localStorage.getItem(`projetoNome_${usuarioLogadoEmail}`) || "";
        const projDesc = localStorage.getItem(`projetoDesc_${usuarioLogadoEmail}`) || "";

        // Preenche os campos de input do formulário
        if (document.getElementById('input-name')) document.getElementById('input-name').value = nome === "Usuário Federados" ? "" : nome;
        if (document.getElementById('input-course')) document.getElementById('input-course').value = curso;
        if (document.getElementById('input-semester')) document.getElementById('input-semester').value = semestre;
        if (document.getElementById('input-bio')) document.getElementById('input-bio').value = bio === "Sua biografia aparecerá aqui..." ? "" : bio;
        
        if (document.getElementById('input-project-name')) document.getElementById('input-project-name').value = projNome;
        if (document.getElementById('input-project-desc')) document.getElementById('input-project-desc').value = projDesc;

        // Updates visuais na interface (Header do perfil)
        if (document.getElementById('display-name')) document.getElementById('display-name').innerText = nome;
        if (document.getElementById('display-course')) document.getElementById('display-course').innerText = curso;
        if (document.getElementById('display-semester')) document.getElementById('display-semester').innerText = semestre;
        if (document.getElementById('display-bio')) document.getElementById('display-bio').innerText = bio;
        if (document.getElementById('display-pic')) document.getElementById('display-pic').src = foto;
    }

    // Inicializa carregando os dados protegidos
    carregarDados();

    // --- 2. SALVAR ALTERAÇÕES EXCLUSIVAS DO USUÁRIO ---
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            const novoNome = document.getElementById('input-name').value.trim();
            const novoCurso = document.getElementById('input-course').value.trim();
            const novoSemestre = document.getElementById('input-semester').value;
            const novaBio = document.getElementById('input-bio').value.trim();

            if (!novoNome || !novoCurso) {
                return alert("Por favor, preencha os campos de Nome e Curso!");
            }

            const fotoFile = document.getElementById('input-file').files[0];
            const projFile = document.getElementById('input-project-file').files[0];

            try {
                // Se enviou foto de perfil, salva na chave exclusiva deste usuário (BUG 4 CORRIGIDO)
                if (fotoFile) {
                    const fotoBase64 = await toBase64(fotoFile);
                    localStorage.setItem(`foto_${usuarioLogadoEmail}`, fotoBase64);
                    if (document.getElementById('display-pic')) {
                        document.getElementById('display-pic').src = fotoBase64;
                    }
                }

                if (projFile) {
                    const projBase64 = await toBase64(projFile);
                    localStorage.setItem(`projetoFoto_${usuarioLogadoEmail}`, projBase64);
                }

                // Salvando com escopo de Usuário utilizando o e-mail como ID (BUG 2 CORRIGIDO)
                localStorage.setItem(`nome_${usuarioLogadoEmail}`, novoNome);
                localStorage.setItem(`curso_${usuarioLogadoEmail}`, novoCurso);
                localStorage.setItem(`semestre_${usuarioLogadoEmail}`, novoSemestre);
                localStorage.setItem(`bio_${usuarioLogadoEmail}`, novaBio || "Sua biografia aparecerá aqui...");
                
                // Salvando dados do Portfólio (BUG 1 CORRIGIDO)
                localStorage.setItem(`projetoNome_${usuarioLogadoEmail}`, document.getElementById('input-project-name').value.trim());
                localStorage.setItem(`projetoDesc_${usuarioLogadoEmail}`, document.getElementById('input-project-desc').value.trim());

                // Atualizando elementos visuais em tempo real
                if (document.getElementById('display-name')) document.getElementById('display-name').innerText = novoNome;
                if (document.getElementById('display-course')) document.getElementById('display-course').innerText = novoCurso;
                if (document.getElementById('display-semester')) document.getElementById('display-semester').innerText = novoSemestre;
                if (document.getElementById('display-bio')) document.getElementById('display-bio').innerText = novaBio || "Sua biografia aparecerá aqui...";

                alert("Todas as alterações foram salvas com sucesso!");

            } catch (error) {
                console.error("Erro ao salvar dados do perfil:", error);
                alert("Erro ao processar as imagens.");
            }
        });
    }

    // --- 3. LOGOUT ENCERRA A SESSÃO NO CLIENTE (CORREÇÃO BUG 5) ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Deseja realmente sair do Federados?")) {
                localStorage.removeItem('usuarioLogado'); // Destrói o token de sessão
                alert("Você saiu do sistema de forma segura.");
                window.location.href = "../Login/index.html"; 
            }
        });
    }
});