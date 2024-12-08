import {sql} from './db.js';

export class Database_postgres {
    // USERS
    async list_users() {
        return sql`SELECT *
                   FROM users`;
    }

    async create_user(user) {

        const { username, email, senha, nome } = user;
        await sql`
            INSERT INTO users (username, email, senha, nome)
            VALUES (${username}, ${email}, ${senha}, ${nome})
        `;
        return user;
    }

    async update_user(id, user) {
        const { username, senha, nome} = user;
        await sql`
            UPDATE users
            SET username = ${username}, senha = ${senha}, nome = ${nome}
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
        return await sql`
            SELECT tasks.*
            FROM tasks
                     JOIN boards ON tasks.board_id = boards.id
            WHERE boards.owner_id = ${user_id};
        `;
    }




    async create_task(task) {
        const { title, description, status, board_id, priority, deadline } = task;

        await sql`
            INSERT INTO tasks (title, description, status, board_id, priority, deadline)
            VALUES (${title}, ${description}, ${status}, ${board_id}, ${priority}, ${deadline} )
        `;
        return task;
    }

    async update_task(id, task) {
        const { title, description, status, priority, deadline } = task;
        await sql`
            UPDATE tasks
            SET title = ${title}, description = ${description}, status = ${status}, priority = ${priority}, deadline = ${deadline}
            WHERE id = ${id}
        `;
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
}