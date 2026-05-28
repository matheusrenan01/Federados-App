document.addEventListener('DOMContentLoaded', function() {
    // --- 1. CARREGAR DADOS DO PERFIL (LATERAL) ---
    const nome = localStorage.getItem('usuarioNome') || "Matheus Renan";
    const curso = localStorage.getItem('usuarioCurso') || "Engenharia da Computação";
    const semestre = localStorage.getItem('usuarioSemestre') || "1º Semestre";
    const foto = localStorage.getItem('usuarioFoto');

    if(document.getElementById('side-name')) document.getElementById('side-name').innerText = nome;
    if(document.getElementById('side-info')) document.getElementById('side-info').innerText = `${curso} | ${semestre}`;
    if(document.getElementById('side-photo') && foto) document.getElementById('side-photo').src = foto;

    // --- 2. CARREGAR DADOS DO PORTFÓLIO ---
    const pNome = localStorage.getItem('projetoNome');
    const pDesc = localStorage.getItem('projetoDesc');
    const pFoto = localStorage.getItem('projetoFoto');
    const areaPortfolio = document.getElementById('portfolio-card');

    if (areaPortfolio && pNome) {
        areaPortfolio.innerHTML = `
            <h3 class="card-title" style="margin-bottom: 10px;">📚 Portfólio de Projetos</h3>
            <div style="text-align: left; width: 100%;">
                <strong style="color: #1c1e21; display: block;">${pNome}</strong>
                <p style="font-size:12px; color:#666; margin: 5px 0;">${pDesc}</p>
                ${pFoto ? `<img src="${pFoto}" style="width:100%; border-radius:8px; display: block; margin-top: 5px;">` : ''}
            </div>
        `;
    }

    // --- 3. LÓGICA DO FEED ---
    const feedContainer = document.getElementById('feed-posts');
    const publishBtn = document.getElementById('publish-btn');
    const postInput = document.getElementById('post-input');
    const photoInput = document.getElementById('post-photo-input');
    const fileInput = document.getElementById('post-file-input');

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    function renderizarPost(dados, index) {
        const postElement = document.createElement('div');
        postElement.className = 'card feed-item';
        postElement.innerHTML = `
            <div class="post-header-wrapper" style="display: flex; justify-content: space-between; align-items: flex-start; position: relative; margin-bottom: 10px;">
                <div class="user-info" style="display: flex; align-items: center;">
                    <img src="${localStorage.getItem('usuarioFoto') || 'https://via.placeholder.com/40'}" style="width:40px; height:40px; border-radius:50%; margin-right:10px; object-fit: cover;">
                    <div>
                        <strong style="display:block;">${dados.autor}</strong>
                        <small style="color: #999;">${dados.data}</small>
                    </div>
                </div>
                <div class="post-menu-container">
                    <button class="post-menu-btn" onclick="toggleMenu(this)" style="background:none; border:none; cursor:pointer;"><i class="fas fa-ellipsis-v"></i></button>
                    <div class="post-menu-dropdown" style="display:none; position:absolute; right:0; top:25px; background:white; border:1px solid #ddd; border-radius:5px; z-index:10; min-width:100px;">
                        <button onclick="editarPost(${index})" style="display:block; width:100%; padding:8px; border:none; background:none; text-align:left; cursor:pointer;"><i class="fas fa-edit"></i> Editar</button>
                        <button onclick="deletarPost(${index})" class="text-danger" style="display:block; width:100%; padding:8px; border:none; background:none; text-align:left; cursor:pointer; color:red;"><i class="fas fa-trash"></i> Excluir</button>
                    </div>
                </div>
            </div>
            <p style="margin-bottom: 10px;">${dados.texto}</p>
            ${dados.foto ? `<img src="${dados.foto}" style="width:100%; border-radius:8px; margin-bottom:10px;">` : ''}
            ${dados.arquivoConteudo ? `<a href="${dados.arquivoConteudo}" download="${dados.arquivoNome}" style="display: block; padding: 10px; background: #f0f2f5; border-radius: 6px; text-decoration: none; color: #003399; font-weight: bold; font-size: 13px;">📁 Baixar: ${dados.arquivoNome}</a>` : ''}
        `;
        feedContainer.prepend(postElement);
    }

    function carregarPosts() {
        const posts = JSON.parse(localStorage.getItem('postsFederados')) || [];
        feedContainer.innerHTML = '';
        posts.forEach((post, index) => renderizarPost(post, index));
    }

    // --- 4. CONTROLE DO MENU E AÇÕES ---
    window.toggleMenu = (btn) => {
        const dropdown = btn.nextElementSibling;
        document.querySelectorAll('.post-menu-dropdown').forEach(d => { if (d !== dropdown) d.style.display = 'none'; });
        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
    };

    window.deletarPost = (index) => {
        if (confirm("Deseja realmente excluir este post?")) {
            let posts = JSON.parse(localStorage.getItem('postsFederados')) || [];
            posts.splice(index, 1);
            localStorage.setItem('postsFederados', JSON.stringify(posts));
            carregarPosts();
        }
    };

    window.editarPost = (index) => { alert("Função de edição em breve!"); };

    // --- 5. PUBLICAÇÃO ---
    if (publishBtn) {
        publishBtn.addEventListener('click', async function() {
            const texto = postInput.value;
            if (!texto && !photoInput.files[0] && !fileInput.files[0]) return alert("Escreva algo!");

            let fotoBase64 = "";
            let arquivoBase64 = "";
            let nomeDoArquivo = "";
            if (photoInput.files[0]) fotoBase64 = await toBase64(photoInput.files[0]);
            if (fileInput.files[0]) {
                arquivoBase64 = await toBase64(fileInput.files[0]);
                nomeDoArquivo = fileInput.files[0].name;
            }

            const novoPost = { autor: nome, texto, foto: fotoBase64, arquivoConteudo: arquivoBase64, arquivoNome: nomeDoArquivo, data: new Date().toLocaleString('pt-BR') };
            const posts = JSON.parse(localStorage.getItem('postsFederados')) || [];
            posts.push(novoPost);
            localStorage.setItem('postsFederados', JSON.stringify(posts));
            carregarPosts();
            postInput.value = "";
        });
    }

    // --- 6. FUNCIONALIDADE DO BOTÃO SAIR (LOGOUT) ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o link de recarregar a tela
            
            // Abre o pop-up de confirmação
            if (confirm("Deseja realmente sair do Federados?")) {
                // Remove a sessão
                localStorage.removeItem('usuarioLogado');
                
                // Exibe o aviso de saída segura
                alert("Você saiu do sistema de forma segura.");
                
                // Redireciona de: Front-end/Feed/index.html -> Front-end/Login/index.html
                window.location.href = "../Login/index.html"; 
            }
        });
    }

    carregarPosts();
});