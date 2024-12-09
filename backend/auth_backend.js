// auth_backend.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY; // Use uma variável de ambiente em produção

// Função para gerar tokens
export function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '30m' });
}

// Middleware para autenticar usuários
export function authenticate(request, reply, done) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        reply.code(401).send({ message: 'Token não fornecido.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        console.log('Verificando token:', token);  // Log para verificar o token recebido
        request.user = jwt.verify(token, SECRET_KEY); // Anexa o usuário decodificado à requisição
        done(); // Continua para a próxima função/middleware
    } catch (err) {
        console.error('Erro na verificação do token:', err); // Log para erro de verificação
        reply.code(401).send({ message: 'Token inválido ou expirado.' });
    }
}

