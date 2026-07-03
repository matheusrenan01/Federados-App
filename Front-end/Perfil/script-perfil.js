document.addEventListener('DOMContentLoaded', () => {

    const btnSave = document.getElementById('btn-save-all');

    // ==========================
    // Carregar dados salvos
    // ==========================
    function carregarDados() {

        const nome = localStorage.getItem('usuarioNome') || "Matheus Renan";
        const curso = localStorage.getItem('usuarioCurso') || "Curso";
        const semestre = localStorage.getItem('usuarioSemestre') || "1º Semestre";
        const foto = localStorage.getItem('usuarioFoto');

        document.getElementById('input-name').value = nome;
        document.getElementById('input-course').value = curso;
        document.getElementById('input-semester').value = semestre;

        document.getElementById('input-project-name').value =
            localStorage.getItem('projetoNome') || "";

        document.getElementById('input-project-desc').value =
            localStorage.getItem('projetoDesc') || "";

        document.getElementById('display-name').innerText = nome;
        document.getElementById('display-course').innerText = curso;
        document.getElementById('display-semester').innerText = semestre;

        if (foto) {
            document.getElementById('display-pic').src = foto;
        }

    }

    carregarDados();

    // ==========================
    // Salvar alterações
    // ==========================
    btnSave.addEventListener('click', () => {

        const novoNome = document.getElementById('input-name').value;
        const novoCurso = document.getElementById('input-course').value;
        const novoSemestre = document.getElementById('input-semester').value;

        localStorage.setItem('usuarioNome', novoNome);
        localStorage.setItem('usuarioCurso', novoCurso);
        localStorage.setItem('usuarioSemestre', novoSemestre);

        localStorage.setItem(
            'projetoNome',
            document.getElementById('input-project-name').value
        );

        localStorage.setItem(
            'projetoDesc',
            document.getElementById('input-project-desc').value
        );

        document.getElementById('display-name').innerText = novoNome;
        document.getElementById('display-course').innerText = novoCurso;
        document.getElementById('display-semester').innerText = novoSemestre;

        // Foto de perfil
        const fotoFile = document.getElementById('input-file').files[0];

        if (fotoFile) {

            const reader = new FileReader();

            reader.onload = function (e) {

                localStorage.setItem('usuarioFoto', e.target.result);
                document.getElementById('display-pic').src = e.target.result;

            };

            reader.readAsDataURL(fotoFile);

        }

        // Foto do projeto
        const projFile = document.getElementById('input-project-file').files[0];

        if (projFile) {

            const readerP = new FileReader();

            readerP.onload = function (e) {

                localStorage.setItem('projetoFoto', e.target.result);

            };

            readerP.readAsDataURL(projFile);

        }

        alert("Alterações salvas com sucesso!");

    });

    // ==========================
    // Logout
    // ==========================
    const btnSair = document.getElementById("btn-sair");
    
    if (btnSair) {

        btnSair.addEventListener("click", function (e) {

            e.preventDefault();

            if (confirm("Deseja sair do sistema?")) {

                // Remove apenas o token, caso exista
                localStorage.removeItem("token");

                // Redireciona para o login
                window.location.href = "../Login/index.html";

            }

        });

    }

});