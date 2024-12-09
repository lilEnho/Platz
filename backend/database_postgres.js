import {sql} from './db.js';

export class Database_postgres {
    // USERS
    async list_users() {
        return sql`SELECT *
                   FROM users`;
    }

    async create_user(user) {

        const { email, senha, nome } = user;
        await sql`
            INSERT INTO users (email, senha, nome)
            VALUES (${email}, ${senha}, ${nome})
        `;
        return user;
    }

    async update_user(id, user) {
        const {senha, nome} = user;
        await sql`
            UPDATE users
            SET senha = ${senha}, nome = ${nome}
            WHERE id = ${id}
        `;
    }

    async delete_user(id) {
        await sql`DELETE FROM users WHERE id = ${id}`;
    }

    // boards
    async list_boards() {
        return sql`SELECT *
                   FROM boards`;
    }

    async create_board(board) {
        const { nome, description, owner_id} = board;
        await sql`
            INSERT INTO boards (nome, description, owner_id)
            VALUES (${nome}, ${description}, ${owner_id})
        `;
        return board;
    }

    async update_board(id, board) {
        const {nome, description} = board;
        await sql`
            UPDATE boards
            SET nome = ${nome}, description = ${description}
            WHERE id = ${id}
        `;
    }

    async delete_board(id) {
        await sql`DELETE FROM boards WHERE id = ${id}`;
    }

    // TASKS
    async list_tasks() {
        return sql`SELECT *
                   FROM tasks`;
    }

    async getTasksForUser(user_id) {
        try {
            return await sql`
                SELECT tasks.*
                FROM tasks
                         JOIN users ON tasks.user_id = users.id
                WHERE tasks.user_id = ${user_id};
            `;
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);  // Log do erro
            throw new Error('Erro ao carregar tarefas do banco de dados.');
        }
    }




    async create_task(task) {
        const { id, description, priority, deadline, coluna, user_id } = task;

        // O valor do "deadline" pode ser "sem deadline", então inserimos diretamente
        await sql`
            INSERT INTO tasks (id, description, priority, deadline, coluna, user_id)
            VALUES (${id}, ${description}, ${priority}, ${deadline}, ${coluna}, ${user_id})
        `;
        return task;
    }



    async update_task(id, task) {
        const { description, priority, deadline, coluna } = task;

        // Realiza a atualização na tabela tasks
          // Retorna a linha atualizada (se houver)
        return await sql`
        UPDATE tasks
        SET description = ${description}, priority = ${priority}, deadline = ${deadline}, coluna = ${coluna}
        WHERE id = ${id}
        RETURNING *;`;  // Retorna o resultado para verificação no método PUT
    }


    async delete_task(id) {
        await sql`DELETE FROM tasks WHERE id = ${id}`;
    }

    // BOARD USERS
    async list_board_users() {
        return sql`SELECT * FROM board_users`;
    }

    async create_board_user(board_user){
        const { user_id, board_id, role } = board_user;
        await sql `INSERT INTO board_users (user_id, board_id, role)
                    VALUES (${user_id}, ${board_id}, ${role})`
    }

    async update_board_user(id, board_user) {
        const {role} = board_user;
        await sql`
            UPDATE board_users
            SET role = ${role}
            WHERE id = ${id}
        `;
    }

    async delete_board_user(id){
        await sql `DELETE FROM board_users WHERE id = ${id}`;
    }

    async getUserById(userId) {
        try {
            const user = await sql`
            SELECT * 
            FROM users 
            WHERE id = ${userId}
        `;
            return user;
        } catch (err) {
            throw new Error('Erro ao buscar o usuário');
        }
    }

}

