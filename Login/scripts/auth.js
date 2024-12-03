// auth.js
console.log("auth.js na parada")

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que o formulário recarregue a página.

        // Captura os valores dos campos de email e senha.
        console.log(document.getElementById("username"));
        console.log(document.getElementById("password"));
        console.log(document.getElementById("email"));



        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            // Faz a requisição para o backend (endpoint /login).
            const response = await fetch('http://localhost:3333/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('const data = await response json de cima')

            const data = await response.json();
            console.log('const data = await response json')

            if (response.ok) {
                console.log("response = ok")
                // Login bem-sucedido: Exibe mensagem e redireciona (se necessário).
                loginStatus.textContent = 'Login bem-sucedido! Redirecionando...';
                loginStatus.style.color = 'green';

                // Exemplo: redirecionar para outra página.
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                console.log("erro de autenticacao")
                // Erro de autenticação.
                loginStatus.textContent = data.message || 'Credenciais inválidas.';
                loginStatus.style.color = 'red';
            }
        } catch (error) {
            // Tratamento de erros inesperados.
            loginStatus.textContent = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
            loginStatus.style.color = 'red';
            console.error('Erro:', error);
        }
    });
});
