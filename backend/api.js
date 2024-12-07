import { fastify } from 'fastify';
import fastifyCors from '@fastify/cors';  // Alteração aqui
import { Database_postgres } from './database_postgres.js';

const server = fastify();
const database = new Database_postgres();

server.register(fastifyCors, {
    origin: "*", // Permite todas as origens (cuidado em produção!)
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // Permite esses métodos
});

// USERS
server.get('/users', async () => {
    return await database.list_users();
});

server.post('/users', async (request, reply) => {
    const { username, email, password_hash } = request.body;
    console.log(username, email, password_hash)
    await database.create_user({ username, email, password_hash});
    return reply.status(201).send();
});

server.put('/users/:id', async (request, reply) => {
    const id = request.params.id;
    const { username, password_hash} = request.body;
    await database.update_user(id, { username, password_hash});
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
    const { name, description, owner_id } = request.body;
    await database.create_board({ name, description, owner_id });
    return reply.status(201).send();
});

server.put('/boards/:id', async (request, reply) => {
    const id = request.params.id;
    const { name, description } = request.body;
    await database.update_board(id, { name, description });
    return reply.status(204).send();
});

server.delete('/boards/:id', async (request, reply) => {
    const id = request.params.id;
    await database.delete_board(id);
    return reply.status(204).send();
});

// TASKS
server.get('/tasks', async () => {
    return await database.list_tasks();
});

server.post('/tasks', async (request, reply) => {
    const { title, description, status, board_id, priority, deadline } = request.body;
    console.log("post task")
    await database.create_task({ title, description, status, board_id, priority, deadline });
    return reply.status(201).send();
});

server.put('/tasks/:id', async (request, reply) => {
    const id = request.params.id;
    const { title, description, status, priority, deadline } = request.body;
    await database.update_task(id, { title, description, status, priority, deadline });
    return reply.status(204).send();
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

server.post('/login', async (request, reply) => {
    const { email, password } = request.body;
    console.log('Requisição post/login recebida')

    // Busca o usuário no banco de dados.
    const users = await database.list_users();
    const user = users.find(u => u.email === email && u.password_hash === password);

    if (user) {
        // Resposta de sucesso.
        reply.code(200).send({ success: true, message: 'Login successful!' });
    } else {
        // Resposta de erro.
        reply.code(401).send({ success: false, message: 'Invalid credentials.' });
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
