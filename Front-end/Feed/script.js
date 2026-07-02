document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA PARA FORMATAR O NOME (Apenas os 2 primeiros nomes) ---
    const nomeCompleto = localStorage.getItem('usuarioNome') || "Matheus Renan";
    const partesDoNome = nomeCompleto.trim().split(' ');
    
    let nomeFormatado = partesDoNome[0]; // Pega o primeiro nome
    if (partesDoNome.length > 1) {
        nomeFormatado += ' ' + partesDoNome[1]; // Adiciona o segundo, se existir
    }

    // --- 1. CARREGAR DADOS DO PERFIL (LATERAL) ---
    const curso = localStorage.getItem('usuarioCurso') || "Engenharia da Computação";
    const semestre = localStorage.getItem('usuarioSemestre') || "1º Semestre";
    const foto = localStorage.getItem('usuarioFoto');

    const nomeCard = document.getElementById('side-name');
    const infoCard = document.getElementById('side-info');
    const fotoCard = document.getElementById('side-photo');

    // Usa a variável nomeFormatado aqui para exibir na lateral
    if(nomeCard) nomeCard.innerText = nomeFormatado;
    if(infoCard) infoCard.innerText = `${curso} | ${semestre}`;
    if(fotoCard && foto) fotoCard.src = foto;

    // --- 2. ATUALIZAR CARD DE PORTFÓLIO ---
    const pNome = localStorage.getItem('projetoNome');
    const pDesc = localStorage.getItem('projetoDesc');
    const pFoto = localStorage.getItem('projetoFoto');
    const areaPortfolio = document.getElementById('portfolio-card');

    if (areaPortfolio && pNome) {
        areaPortfolio.innerHTML = `
            <h3 class="card-title">📚 Portfólio de Projetos</h3>
            <div style="margin-top:10px; text-align: left;">
                <strong style="color: #1c1e21;">${pNome}</strong>
                <p style="font-size:12px; color:#666;">${pDesc}</p>
                ${pFoto ? `<img src="${pFoto}" style="width:100%; border-radius:8px; margin-top:5px; max-height: 150px; object-fit: cover;">` : ''}
            </div>
        `;
    }

    // --- 3. LÓGICA DO FEED (POSTAGENS) ---
    const feedContainer = document.getElementById('feed-posts');
    const publishBtn = document.getElementById('publish-btn');
    const postInput = document.getElementById('post-input');
    const photoInput = document.getElementById('post-photo-input');
    const fileInput = document.getElementById('post-file-input');

    // Função para carregar posts do LocalStorage
    function carregarPosts() {
        const posts = JSON.parse(localStorage.getItem('postsFederados')) || [];
        feedContainer.innerHTML = ''; // Limpa para não duplicar
        posts.forEach(post => renderizarPost(post));
    }

    // Função para converter arquivo em Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // Função para desenhar o post na tela
    function renderizarPost(dados) {
        const postElement = document.createElement('div');
        postElement.className = 'card feed-item';
        postElement.innerHTML = `
            <div class="user-info" style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="${localStorage.getItem('usuarioFoto') || 'https://via.placeholder.com/40'}" class="user-thumb" style="width:40px; height:40px; border-radius:50%; margin-right:10px; object-fit: cover;">
                <div>
                    <strong style="display:block;">${dados.autor}</strong>
                    <small style="color: #999;">${dados.data}</small>
                </div>
            </div>
            <p style="margin-bottom: 10px;">${dados.texto}</p>
            ${dados.foto ? `<img src="${dados.foto}" class="post-media" style="width:100%; border-radius:8px; margin-bottom:10px;">` : ''}
            ${dados.arquivoConteudo ? `
                <a href="${dados.arquivoConteudo}" download="${dados.arquivoNome}" class="file-attachment" style="display: block; padding: 10px; background: #f0f2f5; border-radius: 6px; text-decoration: none; color: #003399; font-weight: bold; font-size: 13px;">
                    📁 Baixar Arquivo: ${dados.arquivoNome}
                </a>` : ''}
        `;
        feedContainer.prepend(postElement); // Adiciona o mais recente no topo
    }

    // Evento de Publicar
    if (publishBtn) {
        publishBtn.addEventListener('click', async function() {
            const texto = postInput.value;
            if (!texto && !photoInput.files[0] && !fileInput.files[0]) return alert("Escreva algo ou adicione um arquivo!");

            let fotoBase64 = "";
            let arquivoBase64 = "";
            let nomeDoArquivo = "";

            if (photoInput.files[0]) fotoBase64 = await toBase64(photoInput.files[0]);
            if (fileInput.files[0]) {
                arquivoBase64 = await toBase64(fileInput.files[0]);
                nomeDoArquivo = fileInput.files[0].name;
            }

            const novoPost = {
                autor: nomeFormatado, // Usa a variável nomeFormatado como autor do novo post!
                texto: texto,
                foto: fotoBase64,
                arquivoConteudo: arquivoBase64,
                arquivoNome: nomeDoArquivo,
                data: new Date().toLocaleString('pt-BR')
            };

            // Salva no banco local
            const postsExistentes = JSON.parse(localStorage.getItem('postsFederados')) || [];
            postsExistentes.push(novoPost);
            localStorage.setItem('postsFederados', JSON.stringify(postsExistentes));

            renderizarPost(novoPost);

            // Limpa os campos
            postInput.value = "";
            photoInput.value = "";
            fileInput.value = "";
        });
    }

    // Inicializa o Feed
    carregarPosts();
});