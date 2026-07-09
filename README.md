## Federados

Projeto acadêmico desenvolvido com o intuito de facilitar a comunicação, gestão de atividades e organização acadêmica entre alunos, professores e funcionários de instituições de ensino superior.

## Visão geral

O Federados reunirá:

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
  * Gestão de atividades
    * Mensagens diretas (limitadas a docente-aluno)
    * Integração com o `Google Agenda`
    * Integração com o _e-mail institucional_


## Tecnologias utilizadas

* **Back-end:** 
  * Java 21, Spring Boot 3.2.5, Spring Security, Spring Data JPA
  

* **Banco de Dados:** 
  * SQLite


* **Front-end:** 
  * HTML5, CSS3, Vanilla JavaScript


* **Build e Dependências:** 
  * Maven


## Pré-requisitos
Para que o projeto inicie corretamente, os seguintes componentes deverão ser instalados:

1. **[Java Development Kit (JDK) 21](https://jdk.java.net/21/)**
2. **[Apache Maven](https://maven.apache.org/download.cgi)** (ou utilize a IDE para gerenciar o build)
3. **IDEs recomendadas:** _**IntelliJ IDEA**_ ou _**VS Code**_.
4. **Extensão para executar o Front-end:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) p/ _**VS Code**_ ou similar para outras IDEs.


_**Obs:** É necessário iniciar o **servidor** antes de executar o **Live Server**, para que a API receba corretamente as requisições._

## Estrutura do Projeto

```text

├── Back-end/  # Códigos e tratamento de funcionalidades do servidor
    └── src
        └── main
            └── java
                └── BackendApplication.java   # inicia o servidor
                
├── Front-end/  # Códigos e lógicas do web app
    └── Cadastro 
    └── Feed  
    └── Login
    └── Perfil
    └── Recuperacao
                 
├── docs/  # Documentação dos requisitos e planejamentos
    └── Requisitos + Planejamento.pdf  
```
