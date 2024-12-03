import { fastify } from 'fastify';
import { Database_postgres } from './database_postgres.js';

const server = fastify();
const database = new Database_postgres();

// USERS
server.get('/users', async () => {
    return await database.list_users();
});

server.post('/users', async (request, reply) => {
    const { name, email, password_hash, created_at } = request.body;
    await database.create_user({ name, email, password_hash, created_at });
    return reply.status(201).send();
});

server.put('/users/:id', async (request, reply) => {
    const id = request.params.id;
    const { name, email, password_hash, created_at } = request.body;
    await database.update_user(id, { name, email, password_hash, created_at });
    return reply.status(204).send();
});

server.delete('/users/:id', async (request, reply) => {
    const id = request.params.id;
    await database.delete_user(id);
    return reply.status(204).send();
});

// TODO LISTS
server.get('/todo-lists', async () => {
    return await database.list_todo_lists();
});

server.post('/todo-lists', async (request, reply) => {
    const { user_id, name } = request.body;
    await database.create_todo_list({ user_id, name });
    return reply.status(201).send();
});

server.put('/todo-lists/:id', async (request, reply) => {
    const id = request.params.id;
    const { name } = request.body;
    await database.update_todo_list(id, { name });
    return reply.status(204).send();
});

server.delete('/todo-lists/:id', async (request, reply) => {
    const id = request.params.id;
    await database.delete_todo_list(id);
    return reply.status(204).send();
});

// TASKS
server.get('/tasks', async () => {
    return await database.list_tasks();
});

server.post('/tasks', async (request, reply) => {
    const { list_id, description, is_done } = request.body;
    console.log("post task")
    await database.create_task({ list_id, description, is_done });
    return reply.status(201).send();
});

server.put('/tasks/:id', async (request, reply) => {
    const id = request.params.id;
    const { description, is_done } = request.body;
    await database.update_task(id, { description, is_done });
    return reply.status(204).send();
});

server.delete('/tasks/:id', async (request, reply) => {
    const id = request.params.id;
    await database.delete_task(id);
    return reply.status(204).send();
});

// Start server
server.listen({ port: 3333 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running at ${address}`);
});