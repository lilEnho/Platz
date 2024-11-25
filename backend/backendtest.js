import {fastify} from 'fastify'
import {DatabaseMemory} from "./database_memory.js";

const server = fastify()

const database = new DatabaseMemory()

server.get('/verme', () => {
    return database.list()
})

server.post('/verme', (request, reply) => {
    const { title, descricao, duracao } = request.body

    database.create({
        title: title,
        descricao: descricao,
        duracao: duracao
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

