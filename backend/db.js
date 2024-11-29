import 'dotenv/config';

console.log(process.env.PGHOST); // Verifica se o PGHOST está sendo carregado corretamente
console.log(process.env.PGUSER); // Verifica se o PGUSER está sendo carregado corretamente


import postgres from "postgres";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;
console.log(URL)
export const sql = postgres(URL, { ssl: 'require' })

async function testarConexao() {
    try {
        const resultado = await sql`SELECT NOW()`;
        console.log('Conexão bem-sucedida! Hora atual no servidor:', resultado);
    } catch (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro);
    }
}

testarConexao();