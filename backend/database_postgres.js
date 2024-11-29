import { randomUUID } from "node:crypto"
import { sql } from './db.js'

export class Database_postgres {
    #videos = new Map()

    async list_users(search) {

        let users

        if (search) {
            users = await sql`select * from usuarios where nome ilike "%${search}%"`
        } else {
            users = sql`select * from usuarios`
        }

        return users

    }

    async create_user(user) {
        const userId = randomUUID();  // Gerando o ID único
        const { nome, email, senha, data_criacao, listas = [] } = user;

        const userWithId = { ...user, id: userId };

        console.log('Create user: ', userId, nome, email, senha, data_criacao, listas)

        await sql`
        insert into usuarios (id, nome, email, senha, data_criacao, listas)
        values (${userId}, ${nome}, ${email}, ${senha}, ${data_criacao}, ${listas})
    `;

        // Retorna o objeto com o id adicionado
        return userWithId;
    }


    update(id, video) {
        return this.#videos.set(id, video)
    }

    delete(id) {
        this.#videos.delete(id)
    }


}