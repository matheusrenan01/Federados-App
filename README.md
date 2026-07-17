## Federados

Projeto acadêmico desenvolvido com o intuito de facilitar a comunicação, gestão de atividades e organização acadêmica entre alunos, professores e funcionários de instituições de ensino superior.

## Visão geral

O Federados reúne:

* **Usuários**
    * Aluno ingressante
    * Aluno veterano
    * Professores
    * Coordenadores de cursos

* **Funcionalidades de rede social**
    * Ambiente para publicação de informativos
    * Interação pública entre usuários (reações)

* **Gestão de atividades**
    * Gerenciamento de exercícios
    * Gerenciamento de datas e prazos de eventos

* **Futuras atualizações**
    * Mensagens diretas _(limitadas a docente-aluno)_
    * Integração com o `Google Agenda`
    * Integração com o _e-mail institucional_

## Tecnologias utilizadas

* **Back-end:**
    * Java 21, Spring Boot 3.2.5, Spring Security, Spring Data JPA, Bean Validation, JJWT

* **Banco de Dados:**
    * SQLite

* **Front-end:**
    * HTML5, CSS3, Vanilla JavaScript

* **Build e Dependências:**
    * Maven

## Segurança

* Autenticação **stateless com JWT**: o login devolve um token que precisa ser enviado em todas as chamadas subsequentes (`Authorization: Bearer <token>`).
* Senhas nunca são armazenadas em texto puro — hash com **BCrypt**.
* Validação de dados no servidor (Bean Validation) em todos os formulários, não só no JavaScript do navegador.
* CORS restrito às origens definidas em `app.cors.allowed-origins`.

## Pré-requisitos

Para que o projeto inicie corretamente, os seguintes componentes deverão ser instalados:

1. **[Java Development Kit (JDK) 21](https://jdk.java.net/21/)**
2. **[Apache Maven](https://maven.apache.org/download.cgi)** (ou utilize a IDE para gerenciar o build)
3. **IDEs recomendadas:** _**IntelliJ IDEA**_ ou _**VS Code**_.
4. **Extensão para executar o Front-end:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) p/ _**VS Code**_ ou similar para outras IDEs.

## Como rodar o projeto

### 1. Variáveis de ambiente (obrigatório)

O projeto **não** guarda segredos no código. Antes de rodar o back-end, defina:

| Variável | Obrigatória? | Descrição |
|---|---|---|
| `SENDGRID_API_KEY` | Sim, para o fluxo de recuperação de senha funcionar | Chave de API do [SendGrid](https://sendgrid.com), usada para enviar o e-mail com o código de recuperação. |
| `JWT_SECRET` | Recomendado | Segredo usado para assinar os tokens JWT. Se não for definido, um valor padrão de desenvolvimento é usado (não use isso em produção). |

Na sua IDE (IntelliJ/VS Code), configure essas variáveis na **Run Configuration** do `BackendApplication`. Via terminal:

```bash
export SENDGRID_API_KEY="sua_chave_aqui"
export JWT_SECRET="uma_string_longa_e_aleatoria"
```

### 2. Rodar o back-end

```bash
cd Back-end
mvn spring-boot:run
```

O servidor sobe em `http://localhost:8080`. O banco SQLite (`database.db`) é criado automaticamente na primeira execução — ele não é versionado no Git (veja `.gitignore`).

### 3. Rodar o front-end

Abra qualquer página de `Front-end/` (comece por `Front-end/Login/index.html`) com o Live Server ou similar.

Se o Live Server abrir numa porta diferente de `5500`, ajuste `app.cors.allowed-origins` em `Back-end/src/main/resources/application.properties`.

O endereço do back-end usado pelo front-end fica centralizado em `Front-end/common/auth.js` (constante `API_BASE_URL`) — é o único lugar que precisa mudar se a API for hospedada em outro endereço.

### 4. Testando

1. Cadastre um usuário em `Cadastro/index.html`.
2. Faça login em `Login/index.html`.
3. Publique um post no Feed e edite seu perfil — os dados agora são persistidos no back-end, não mais no `localStorage` do navegador.

## Estrutura do Projeto

```text
├── Back-end/                          # API REST (Spring Boot)
    └── src/main/java/com/seuapp
        ├── config/                    # Segurança, JWT, tratamento global de erros
        ├── controller/                # Endpoints REST (auth, posts, usuários)
        ├── dto/                       # Objetos de entrada/saída da API
        ├── model/                     # Entidades JPA (User, Post)
        ├── repository/                # Acesso ao banco (Spring Data JPA)
        ├── service/                   # Regras de negócio
        └── BackendApplication.java    # inicia o servidor

├── Front-end/                         # Web app (HTML/CSS/JS puro)
    ├── common/                        # Código compartilhado entre páginas (auth.js)
    ├── Cadastro
    ├── Feed
    ├── Login
    ├── Perfil
    └── Recuperacao

├── docs/                              # Documentação dos requisitos e planejamento
    └── Requisitos + Planejamento.pdf
```
