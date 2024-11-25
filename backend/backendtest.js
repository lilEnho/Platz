// import { createServer } from 'node:http';

// const server = createServer((request, response) => {
//     console.log(`Requisição recebida para: ${request.url}`);
//    console.log('oi');
//     response.write('verme');
//     response.write('doido');
//     return response.end();
// });

// server.listen(3333);


// POST localhost:3333/videos
// DELETE localhost:3333/videos/1

import { fastify } from 'fastify'

const server = fastify()

server.get('/', () => {return 'verme demais'})

server.get('/verme', () => {return 'verme demais kkkkkkk'})

server.listen({
    port:3333
})

