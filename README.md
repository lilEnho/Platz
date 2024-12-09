## Trabalho Prático - INE5646

### Equipe: Enzo Amaral Custodio (22202688), Leonardo Dias Gutterres (24206403), Marcos Andrei Dranka (17200457) , Rafael Nascimento Siqueira Pinto (23203399)

# Kanban board

## Front-end

O front-end é responsável pela interface do usuário e interação com o sistema. Utilizamos HTML, CSS e JavaScript para desenvolver as páginas e funcionalidades. Abaixo estão os principais arquivos e suas responsabilidades:

### `login.html`
Página de login onde os usuários inserem suas credenciais para acessar o sistema.

### `kanban.html`
Página principal do Kanban board, onde os usuários podem visualizar, criar, editar e mover tarefas entre colunas.

### `cadastro.html`
Página de cadastro de novos usuários.

### `perfil.html`
Página de perfil do usuário, onde é possível visualizar e editar informações pessoais.

### `styles/style.css`
Arquivo de estilos para a página de login, definindo a aparência geral e layout.

### `styles/kanban.css`
Arquivo de estilos específico para o Kanban board, incluindo cores, tamanhos e posicionamento dos elementos.

### `styles/fonts.css`
Arquivo de definição das fontes utilizadas no projeto.

### `scripts/kanban.js`
Arquivo JavaScript contendo a lógica para manipulação das tarefas no Kanban board, incluindo criação, edição, exclusão e movimentação de tarefas.

### `scripts/auth.js`
Arquivo JavaScript contendo a lógica para autenticação de usuários, incluindo login e redirecionamento para a página de cadastro.

### `scripts/cadastro.js`
Arquivo JavaScript contendo a lógica para o cadastro de novos usuários, incluindo validação de campos e envio de dados para o backend.

### `scripts/perfil.js`
Arquivo JavaScript contendo a lógica para manipulação do perfil do usuário, incluindo visualização e edição de informações pessoais, alteração de senha e exclusão de conta.

### `components/fonts/stylesheet.css`
Arquivo de definição das fontes utilizadas no projeto, importando as fontes necessárias.


## Back-end

O back-end é reponsável por executar alterações no banco de dados, que é onde ficam armazenadas todas as informações do sistema. No trabalho, optamos por usar o Node.js, pois foi visto em aula e é mais simples de utilizar. As rotas foram criadas usando funções assíncronas com *async*/*await*.
Para facilitar o desenvolvimento, foram utilizadas algumas bibliotecas disponíveis para o Node.js. São as seguintes:
* *jsonwebtoken* - Utilizado para gerenciar a autenticação de usuários.
* *fastify/cors* - Fornece alguns recursos para gerenciar o servidor, como controle de conexões e operações permitidas.
* *postgres* - Utilizado para criar e gerenciar a conexão com o banco de dados. Optamos por utilizar o PostgreSQL no desenvolvimento do trabalho.
* *dotenv* - Utilizado para gerenciar credenciais do banco de dados, evitando que fique exposto no código.

O back-end foi dividido em quatro arquivos, para melhor organização.

## `api.js`
É o arquivo que contém as rotas a serem utilizadas para executar operações na aplicação. As rotas utilizam o verbos HTTP GET, POST, PUT e DELETE. Cada rota recebe os dados do front-end e executa as operações de obter dados, inserir, modificar ou excluir informações no banco de dados.

## `auth_backend.js`
Utiliza a biblioteca *jsonwebtoken* para autenticar usuários. As funções deste aquivo são chamadas para criar uma sessão e verificar se a sessão é válida. A duração da sessão foi definida como 1 hora.

## `database_postgres.js`
Arquivo onde estão as funções chamadas nas rotas. As funções recebem os dados e fazem as operações no banco de dados.

## `db.js`
Arquivo para configuração do acesso ao banco de dados.

