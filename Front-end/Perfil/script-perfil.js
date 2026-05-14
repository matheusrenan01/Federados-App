document.addEventListener('DOMContentLoaded', () => {
    const btnSave = document.getElementById('btn-save-all');
    
    // Função para carregar dados salvos ao abrir a página
    function carregarDados() {
        const nome = localStorage.getItem('usuarioNome') || "Matheus Renan";
        const curso = localStorage.getItem('usuarioCurso') || "Curso";
        const semestre = localStorage.getItem('usuarioSemestre') || "1º Semestre";
        const foto = localStorage.getItem('usuarioFoto');

        // Preenche os campos de input
        document.getElementById('input-name').value = nome;
        document.getElementById('input-course').value = curso;
        document.getElementById('input-semester').value = semestre;
        document.getElementById('input-project-name').value = localStorage.getItem('projetoNome') || "";
        document.getElementById('input-project-desc').value = localStorage.getItem('projetoDesc') || "";

        // Atualiza o topo visual da página
        document.getElementById('display-name').innerText = nome;
        document.getElementById('display-course').innerText = curso;
        document.getElementById('display-semester').innerText = semestre;
        if(foto) document.getElementById('display-pic').src = foto;
    }

    carregarDados();

    btnSave.addEventListener('click', () => {
        const novoNome = document.getElementById('input-name').value;
        const novoCurso = document.getElementById('input-course').value;
        const novoSemestre = document.getElementById('input-semester').value;

        // Salvar textos no LocalStorage
        localStorage.setItem('usuarioNome', novoNome);
        localStorage.setItem('usuarioCurso', novoCurso);
        localStorage.setItem('usuarioSemestre', novoSemestre);
        localStorage.setItem('projetoNome', document.getElementById('input-project-name').value);
        localStorage.setItem('projetoDesc', document.getElementById('input-project-desc').value);

        // Atualizar o topo visual IMEDIATAMENTE
        document.getElementById('display-name').innerText = novoNome;
        document.getElementById('display-course').innerText = novoCurso;
        document.getElementById('display-semester').innerText = novoSemestre;

        // Processar Foto de Perfil
        const fotoFile = document.getElementById('input-file').files[0];
        if (fotoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                localStorage.setItem('usuarioFoto', e.target.result);
                document.getElementById('display-pic').src = e.target.result;
            };
            reader.readAsDataURL(fotoFile);
        }

        // Processar Foto de Projeto
        const projFile = document.getElementById('input-project-file').files[0];
        if (projFile) {
            const readerP = new FileReader();
            readerP.onload = (e) => localStorage.setItem('projetoFoto', e.target.result);
            readerP.readAsDataURL(projFile);
        }

        alert("Alterações salvas com sucesso!");
    });

    document.getElementById('btn-sair').addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm("Deseja sair do sistema?")) alert("Você saiu.");
    });
});