import {fastify} from 'fastify'
import {Database_postgres} from "./database_postgres.js";

const server = fastify()

const database = new Database_postgres()

server.get('/verme', async () => {
    return await database.list_users()
})

server.post('/verme', async (request, reply) => {
    const { nome, email, senha, data_criacao } = request.body

    console.log(nome, email, senha, data_criacao)

    await database.create_user({
        nome: nome,
        email: email,
        senha: senha,
        data_criacao: data_criacao
    })

    return reply.status(201).send()
})

server.put('/verme/:id', (request, reply) => {
    const videoId = request.params.id
    const {title, descricao, duracao} = request.body

    database.update(videoId, {
        title,
        descricao,
        duracao,
    })

    return reply.status(204).send()
})

server.delete('/verme/:id', (request, reply) => {
    const videoID = request.params.id

    database.delete(videoID)

    return reply.status(204).send()
})

server.listen({
    port:3333
})

