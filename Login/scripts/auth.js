document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');
    const signupButton = document.getElementById('btn'); // Botão "Não tem uma conta?"

    // Adicionando o event listener para o botão "Não tem uma conta?"
    signupButton.addEventListener('click', redirectToSignupPage);

    // Adicionando o event listener para o formulário de login
    loginForm.addEventListener('submit', handleLogin);

});

// Função para redirecionar para a página de cadastro
function redirectToSignupPage(event) {
    event.preventDefault(); // Evita comportamento padrão do link
    window.location.href = 'cadastro.html'; // Redireciona para a página de cadastro
}

// Função para tratar o envio do formulário de login
async function handleLogin(event) {
    event.preventDefault(); // Evita que o formulário recarregue a página

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const loginStatus = document.getElementById('loginStatus');

    try {
        // Faz a requisição para o backend (endpoint /login)
        const response = await fetch('http://localhost:3333/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login bem-sucedido
            loginStatus.textContent = 'Login bem-sucedido! Redirecionando...';
            loginStatus.style.color = 'green';

            localStorage.setItem('token', data.token);

            setTimeout(() => {
                window.location.href = 'kanban.html';
            }, 2000);
        } else {
            // Erro de autenticação
            loginStatus.textContent = data.message || 'Credenciais inválidas.';
            loginStatus.style.color = 'red';
        }
    } catch (error) {
        // Erro ao conectar ao servidor
        loginStatus.textContent = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
        loginStatus.style.color = 'red';
        console.error('Erro:', error);
    }
}

