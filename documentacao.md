## Trabalho Prático - INE5646

### Equipe: Enzo Amaral Custodio, Leonardo Dias Gutterres, Luan Rodrigo da Silva Costa, Marcos Andrei Dranka, Rafael Nascimento Siqueira Pinto

# Kanban board

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
