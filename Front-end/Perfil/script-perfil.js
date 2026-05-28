document.addEventListener('DOMContentLoaded', () => {
    const btnSave = document.getElementById('btn-save-all');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Função utilitária para converter arquivo em Base64 usando Promises (Evita bugs de assincronia)
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // --- 1. CARREGAR DADOS SALVOS AO ABRIR A PÁGINA ---
    function carregarDados() {
        const nome = localStorage.getItem('usuarioNome') || "Matheus Renan";
        const curso = localStorage.getItem('usuarioCurso') || "Engenharia da Computação";
        const semestre = localStorage.getItem('usuarioSemestre') || "3º Período";
        const foto = localStorage.getItem('usuarioFoto');

        // Preenche os campos de input (se existirem na página)
        if (document.getElementById('input-name')) document.getElementById('input-name').value = nome;
        if (document.getElementById('input-course')) document.getElementById('input-course').value = curso;
        if (document.getElementById('input-semester')) document.getElementById('input-semester').value = semestre;
        
        if (document.getElementById('input-project-name')) {
            document.getElementById('input-project-name').value = localStorage.getItem('projetoNome') || "";
        }
        if (document.getElementById('input-project-desc')) {
            document.getElementById('input-project-desc').value = localStorage.getItem('projetoDesc') || "";
        }

        // Updates visuais do header do perfil
        if (document.getElementById('display-name')) document.getElementById('display-name').innerText = nome;
        if (document.getElementById('display-course')) document.getElementById('display-course').innerText = curso;
        if (document.getElementById('display-semester')) document.getElementById('display-semester').innerText = semestre;
        if (foto && document.getElementById('display-pic')) document.getElementById('display-pic').src = foto;
    }

    // Inicializa carregando os dados do LocalStorage
    carregarDados();

    // --- 2. SALVAR ALTERAÇÕES DO FORMULÁRIO ---
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            const novoNome = document.getElementById('input-name').value.trim();
            const novoCurso = document.getElementById('input-course').value.trim();
            const novoSemestre = document.getElementById('input-semester').value;

            if (!novoNome || !novoCurso) {
                return alert("Por favor, preencha os campos de Nome e Curso!");
            }

            const fotoFile = document.getElementById('input-file').files[0];
            const projFile = document.getElementById('input-project-file').files[0];

            try {
                if (fotoFile) {
                    const fotoBase64 = await toBase64(fotoFile);
                    localStorage.setItem('usuarioFoto', fotoBase64);
                    if (document.getElementById('display-pic')) {
                        document.getElementById('display-pic').src = fotoBase64;
                    }
                }

                if (projFile) {
                    const projBase64 = await toBase64(projFile);
                    localStorage.setItem('projetoFoto', projBase64);
                }

                localStorage.setItem('usuarioNome', novoNome);
                localStorage.setItem('usuarioCurso', novoCurso);
                localStorage.setItem('usuarioSemestre', novoSemestre);
                localStorage.setItem('projetoNome', document.getElementById('input-project-name').value.trim());
                localStorage.setItem('projetoDesc', document.getElementById('input-project-desc').value.trim());

                if (document.getElementById('display-name')) document.getElementById('display-name').innerText = novoNome;
                if (document.getElementById('display-course')) document.getElementById('display-course').innerText = novoCurso;
                if (document.getElementById('display-semester')) document.getElementById('display-semester').innerText = novoSemestre;

                alert("Todas as alterações foram salvas com sucesso!");

            } catch (error) {
                console.error("Erro ao salvar dados do perfil:", error);
                alert("Erro ao processar as imagens.");
            }
        });
    }

    // --- 3. FUNCIONALIDADE DO BOTÃO SAIR (LOGOUT) ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que a página recarregue pelo href="#"
            
            if (confirm("Deseja realmente sair do Federados?")) {
                // Remove a chave de autenticação que seu formulário de Login cria
                localStorage.removeItem('usuarioLogado');
                
                alert("Você saiu do sistema de forma segura.");
                
                // Redireciona saindo da pasta Perfil e entrando na pasta Login
                window.location.href = "../Login/index.html"; 
            }
        });
    }
});