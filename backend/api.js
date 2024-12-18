import { fastify } from 'fastify';
import fastifyCors from '@fastify/cors';  // Alteração aqui
import { Database_postgres } from './database_postgres.js';
import { authenticate, generateToken } from './auth_backend.js';

const server = fastify();
const database = new Database_postgres();

server.register(fastifyCors, {
    origin: "*", // Permite todas as origens (cuidado em produção!)
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // Permite esses métodos
});

// USERS
server.get('/users', {
    preHandler: authenticate, // Use preHandler para autenticação
}, async (request, reply) => {
    const userId = request.user.id; // ID do usuário autenticado
    try {
        const user = await database.getUserById(userId); // Buscar usuário pelo ID
        reply.send(user);
    } catch (err) {
        reply.code(500).send({ message: 'Erro ao buscar dados do usuário' });
    }
});



server.post('/users', async (request, reply) => {
    const { email, senha , nome } = request.body;
    await database.create_user({ email, senha, nome});
    return reply.status(201).send({message: "Usuário cadastrado co sucesso!"});
});

server.put('/users/:id', async (request, reply) => {
    const id = request.params.id;
    const { senha, nome} = request.body;
    await database.update_user(id, {senha, nome});
    return reply.status(204).send();
});

server.delete('/users/:id', async (request, reply) => {
    const id = request.params.id;
    await database.delete_user(id);
    return reply.status(204).send();
});

// boards
server.get('/boards', async () => {
    return await database.list_boards();
});

server.post('/boards', async (request, reply) => {
    const { nome, description, owner_id } = request.body;
    await database.create_board({ nome, description, owner_id });
    return reply.status(201).send();
});

server.put('/boards/:id', async (request, reply) => {
    const id = request.params.id;
    const { nome, description } = request.body;
    await database.update_board(id, { nome, description });
    return reply.status(204).send();
});

server.delete('/boards/:id', async (request, reply) => {
    const id = request.params.id;
    await database.delete_board(id);
    return reply.status(204).send();
});

// TASKS
server.get('/tasks', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id; // O ID do usuário autenticado
    console.log("user id:", userId)
    const tasks = await database.getTasksForUser(userId); // Recupera as tarefas do usuário
    reply.send(tasks); // Envia as tarefas de volta para o cliente
});

server.post('/tasks', { preHandler: authenticate }, async (request, reply) => {
    const { id, description, priority, deadline, coluna } = request.body; // Agora recebe o ID
    const userId = request.user.id; // ID do usuário autenticado

    // Verifique se o ID é válido (caso queira garantir que o ID não seja inválido)
    if (!id || typeof id !== 'number') {
        return reply.status(400).send({ error: 'ID inválido.' });
    }

    // Insira a tarefa no banco de dados, associando o ID e o usuário
    const task = await database.create_task({
        id,          // Usa o ID enviado
        description,
        priority,
        deadline,
        coluna,
        user_id: userId // A tarefa será associada ao usuário
    });

    return reply.status(201).send(task);  // Retorna a tarefa criada
});


server.put('/tasks/:id', async (request, reply) => {
    const { id } = request.params;  // Captura o ID da URL
    const { description, priority, deadline, coluna } = request.body;  // Captura os dados da tarefa enviados no corpo da requisição

    const task = { description, priority, deadline, coluna };

    try {
        // Chama a função update_task para realizar a atualização no banco
        const updatedTask = await database.update_task(id, task);

        // Retorna a tarefa atualizada como resposta
        reply.send(updatedTask[0]);

    } catch (error) {
        console.error('Erro ao atualizar a tarefa:', error);
        reply.status(500).send({ message: 'Erro interno do servidor' });
    }
});

server.delete('/tasks/:id', async (request, reply) => {
    const id = request.params.id;
    await database.delete_task(id);
    return reply.status(204).send();
});

server.get('/board_users', async() => {
    return await database.list_board_users();
})

server.post('/board_users', async (request, reply) => {
    const {user_id, board_id, role} = request.body;
    await database.create_board_user({user_id, board_id, role});
    return reply.status(201).send();
})

server.put('/board_users/:id', async (request, reply) => {
    const id = request.params.id;
    const {role} = request.body;
    await database.update_board_user(id, {role})
    return reply.status(204).send();
})

server.delete('/board_users/:id', async (request, reply) => {
    const id = request.params.id;
    await database.delete_board_user(id);
    return reply.status(204).send();
})


server.get('/kanbans', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user.id; // ID do usuário autenticado
    const kanbans = await database.getUserKanbans(userId);
    return reply.send(kanbans);
});

// Exemplo de login que gera o token
server.post('/login', async (request, reply) => {
    const { email, password } = request.body;
    const users = await database.list_users();
    const user = users.find(u => u.email === email && u.senha === password);

    if (user) {
        const token = generateToken({ id: user.id, email: user.email });
        console.log(token)
        reply.send({ token });
    } else {
        reply.code(401).send({ message: 'Credenciais inválidas.' });
    }
});

// Start server
server.listen({ port: 3333 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running at ${address}`);
});

