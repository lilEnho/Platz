import { sql } from './db.js';

export class Database_postgres {
    // USERS
    async list_users() {
        return sql`SELECT *
                   FROM users`;
    }

    async create_user(user) {
        const { name, email, password_hash, created_at = new Date(), updated_at = new Date() } = user;
        await sql`
            INSERT INTO users (name, email, password_hash, created_at)
            VALUES (${name}, ${email}, ${password_hash}, ${created_at})
        `;
        return user;
    }

    async update_user(id, user) {
        const { name, email, password_hash} = user;
        console.log(user)
        await sql`
            UPDATE users
            SET name = ${name}, email = ${email}, password_hash = ${password_hash}
            WHERE id = ${id}
        `;
    }

    async delete_user(id) {
        await sql`DELETE FROM users WHERE id = ${id}`;
    }

    // TODO LISTS
    async list_todo_lists() {
        return sql`SELECT *
                   FROM todo_lists`;
    }

    async create_todo_list(todo_list) {
        const { user_id, name, created_at = new Date(), updated_at = new Date() } = todo_list;
        await sql`
            INSERT INTO todo_lists (user_id, name, created_at, updated_at)
            VALUES (${user_id}, ${name}, ${created_at}, ${updated_at})
        `;
        return todo_list;
    }

    async update_todo_list(id, todo_list) {
        const { name, updated_at = new Date() } = todo_list;
        await sql`
            UPDATE todo_lists
            SET name = ${name}, updated_at = ${updated_at}
            WHERE id = ${id}
        `;
    }

    async delete_todo_list(id) {
        await sql`DELETE FROM todo_lists WHERE id = ${id}`;
    }

    // TASKS
    async list_tasks() {
        return sql`SELECT *
                   FROM tasks`;
    }

    async create_task(task) {
        const { list_id, description, is_done = false, created_at = new Date() } = task;

        console.log(task);

        await sql`
            INSERT INTO tasks (list_id, description, is_done, created_at)
            VALUES (${list_id}, ${description}, ${is_done}, ${created_at})
        `;
        return task;
    }

    async update_task(id, task) {
        const { description, is_done, updated_at = new Date() } = task;
        await sql`
            UPDATE tasks
            SET description = ${description}, is_done = ${is_done}, updated_at = ${updated_at}
            WHERE id = ${id}
        `;
    }

    async delete_task(id) {
        await sql`DELETE FROM tasks WHERE id = ${id}`;
    }
}
