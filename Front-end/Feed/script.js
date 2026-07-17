document.addEventListener('DOMContentLoaded', async function() {

    // --- 0. PROTOCOLO DE SEGURANÇA ---
    // Antes: só olhava se existia 'usuarioLogado' no localStorage (fácil de forjar).
    // Agora: pergunta pro back-end se o token JWT é válido de verdade.
    const usuarioAutenticado = await protegerPagina();
    if (!usuarioAutenticado) return; // protegerPagina() já redirecionou

    // --- 1. DADOS DO PERFIL NA LATERAL ---
    // Antes vinham de localStorage.getItem(`nome_${email}`) etc -- cada navegador
    // tinha sua própria cópia. Agora vêm direto da resposta de /api/auth/me.
    const { nome, curso, periodo, departamento, foto,
            projetoNome, projetoDescricao, projetoFoto } = usuarioAutenticado;

    if (document.getElementById('side-name')) document.getElementById('side-name').innerText = nome;
    if (document.getElementById('side-photo')) document.getElementById('side-photo').src = foto || "https://via.placeholder.com/80";

    let infoVinculo = "Informações não preenchidas";
    if (curso) infoVinculo = `${curso}${periodo ? ` | ${periodo}º Semestre` : ''}`;
    else if (departamento) infoVinculo = departamento;
    if (document.getElementById('side-info')) document.getElementById('side-info').innerText = infoVinculo;

    // --- 2. PORTFÓLIO ---
    const areaPortfolio = document.getElementById('portfolio-card');
    if (areaPortfolio) {
        if (projetoNome && projetoNome.trim() !== "") {
            areaPortfolio.innerHTML = `
                <h3 class="card-title" style="margin-bottom: 10px;">📚 Portfólio de Projetos</h3>
                <div style="text-align: left; width: 100%;">
                    <strong style="color: #1c1e21; display: block;">${projetoNome}</strong>
                    <p style="font-size:12px; color:#666; margin: 5px 0;">${projetoDescricao || 'Sem descrição'}</p>
                    ${projetoFoto ? `<img src="${projetoFoto}" style="width:100%; border-radius:8px; display: block; margin-top: 5px;">` : ''}
                </div>
            `;
        } else {
            areaPortfolio.innerHTML = `
                <h3 class="card-title" style="margin-bottom: 10px;">📚 Portfólio de Projetos</h3>
                <p style="font-size:12px; color:#999; text-align:center; padding: 10px 0;">Nenhum projeto adicionado ao seu perfil.</p>
            `;
        }
    }

    // --- 3. LÓGICA DO FEED (agora falando com a API, não mais com o localStorage) ---
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

    function renderizarPost(dados) {
        const postElement = document.createElement('div');
        postElement.className = 'card feed-item';

        const fotoAutorPost = dados.autorFoto || 'https://via.placeholder.com/40';
        // Quem pode editar/excluir agora é decidido pelo back-end (dados.ehDono),
        // não mais comparando e-mails no próprio navegador.
        const ehDonoDoPost = dados.ehDono;

        const dataFormatada = new Date(dados.criadoEm).toLocaleString('pt-BR')
            + (dados.editado ? " (Editado)" : "");

        postElement.innerHTML = `
            <div class="post-header-wrapper" style="display: flex; justify-content: space-between; align-items: flex-start; position: relative; margin-bottom: 10px;">
                <div class="user-info" style="display: flex; align-items: center;">
                    <img src="${fotoAutorPost}" style="width:40px; height:40px; border-radius:50%; margin-right:10px; object-fit: cover;">
                    <div>
                        <strong style="display:block;">${dados.autor}</strong>
                        <small style="color: #999;">${dataFormatada}</small>
                    </div>
                </div>
                <div class="post-menu-container">
                    <button class="post-menu-btn" onclick="toggleMenu(this)" style="background:none; border:none; cursor:pointer;"><i class="fas fa-ellipsis-v"></i></button>
                    <div class="post-menu-dropdown" style="display:none; position:absolute; right:0; top:25px; background:white; border:1px solid #ddd; border-radius:5px; z-index:10; min-width:100px;">
                        ${ehDonoDoPost ?
                            `<button onclick="editarPost(${dados.id})" style="display:block; width:100%; padding:8px; border:none; background:none; text-align:left; cursor:pointer;"><i class="fas fa-edit"></i> Editar</button>`
                            : `<button disabled style="display:block; width:100%; padding:8px; border:none; background:none; text-align:left; color:#ccc; cursor:not-allowed;"><i class="fas fa-lock"></i> Bloqueado</button>`
                        }
                        ${ehDonoDoPost ?
                            `<button onclick="deletarPost(${dados.id})" class="text-danger" style="display:block; width:100%; padding:8px; border:none; background:none; text-align:left; cursor:pointer; color:red;"><i class="fas fa-trash"></i> Excluir</button>`
                            : ''
                        }
                    </div>
                </div>
            </div>
            <p style="margin-bottom: 10px;">${dados.texto || ''}</p>
            ${dados.foto ? `<img src="${dados.foto}" style="width:100%; border-radius:8px; margin-bottom:10px;">` : ''}
            ${dados.arquivoConteudo ? `<a href="${dados.arquivoConteudo}" download="${dados.arquivoNome}" style="display: block; padding: 10px; background: #f0f2f5; border-radius: 6px; text-decoration: none; color: #003399; font-weight: bold; font-size: 13px;">📁 Baixar: ${dados.arquivoNome}</a>` : ''}
        `;
        feedContainer.appendChild(postElement);
    }

    async function carregarPosts() {
        try {
            const resposta = await authFetch(`${API_BASE_URL}/api/posts`);
            if (!resposta.ok) {
                feedContainer.innerHTML = '<p style="text-align:center; color:#999;">Não foi possível carregar as publicações.</p>';
                return;
            }
            const posts = await resposta.json(); // já vem ordenado do mais novo pro mais antigo
            feedContainer.innerHTML = '';
            posts.forEach(renderizarPost);
        } catch (erro) {
            console.error("Erro ao carregar posts:", erro);
            feedContainer.innerHTML = '<p style="text-align:center; color:#999;">Erro de conexão com o servidor.</p>';
        }
    }

    // --- 4. CONTROLE DO MENU E AÇÕES ---
    window.toggleMenu = (btn) => {
        const dropdown = btn.nextElementSibling;
        document.querySelectorAll('.post-menu-dropdown').forEach(d => { if (d !== dropdown) d.style.display = 'none'; });
        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
    };

    window.deletarPost = async (id) => {
        if (!confirm("Deseja realmente excluir este post?")) return;

        const resposta = await authFetch(`${API_BASE_URL}/api/posts/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
            carregarPosts();
        } else {
            const mensagem = await extrairMensagemErro(resposta);
            alert("Não foi possível excluir: " + mensagem);
        }
    };

    window.editarPost = async (id) => {
        const novoTexto = prompt("Edite o texto da sua publicação:");
        if (novoTexto === null) return;
        if (novoTexto.trim() === "") return alert("A publicação não pode ficar vazia!");

        const resposta = await authFetch(`${API_BASE_URL}/api/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: novoTexto.trim() })
        });

        if (resposta.ok) {
            carregarPosts();
        } else {
            const mensagem = await extrairMensagemErro(resposta);
            alert("Não foi possível editar: " + mensagem);
        }
    };

    // --- 5. PUBLICAÇÃO ---
    if (publishBtn) {
        publishBtn.addEventListener('click', async function() {
            const texto = postInput.value.trim();
            if (!texto && !photoInput.files[0] && !fileInput.files[0]) return alert("Escreva algo!");

            let fotoBase64 = null;
            let arquivoBase64 = null;
            let nomeDoArquivo = null;
            if (photoInput.files[0]) fotoBase64 = await toBase64(photoInput.files[0]);
            if (fileInput.files[0]) {
                arquivoBase64 = await toBase64(fileInput.files[0]);
                nomeDoArquivo = fileInput.files[0].name;
            }

            const resposta = await authFetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    texto,
                    foto: fotoBase64,
                    arquivoConteudo: arquivoBase64,
                    arquivoNome: nomeDoArquivo
                })
            });

            if (resposta.ok) {
                postInput.value = "";
                photoInput.value = "";
                fileInput.value = "";
                carregarPosts();
            } else {
                const mensagem = await extrairMensagemErro(resposta);
                alert("Não foi possível publicar: " + mensagem);
            }
        });
    }

    // --- 6. FUNCIONALIDADE DO BOTÃO SAIR (LOGOUT) ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout(); // definido em common/auth.js — limpa authToken + usuarioLogado
        });
    }

    carregarPosts();
});
