document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.querySelector('form');
    const statusMessage = document.createElement('div');
    cadastroForm.appendChild(statusMessage);

    cadastroForm.addEventListener('submit', handleCadastro);

    // Redireciona o botão "Já tem uma conta?" para index.html
    const btnJaTemConta = document.querySelector('#btn');
    btnJaTemConta.addEventListener('click', (event) => {
        event.preventDefault(); // Evita comportamento padrão do link
        window.location.href = 'login.html'; // Redireciona para index.html
    });

    // Redireciona o botão "Início" para index.html
    const btnInicio = document.querySelector('a[href="#"]:nth-of-type(1)');
    btnInicio.addEventListener('click', (event) => {
        event.preventDefault(); // Evita comportamento padrão do link
        window.location.href = 'login.html'; // Redireciona para index.html
    });
});

// Função para lidar com o envio do formulário de cadastro
async function handleCadastro(event) {
    event.preventDefault(); // Evita o envio padrão do formulário (recarregar a página)

    // Pegando os valores dos campos
    const nome = document.querySelector('input[placeholder="Nome"]').value.trim();
    const email = document.querySelector('input[placeholder="Email"]').value.trim();
    const senha = document.querySelector('input[placeholder="Senha"]').value.trim();
    const senhaConfirmada = document.querySelector('input[placeholder="Confirme a Senha"]').value.trim();

    const statusMessage = document.querySelector('form > div');

    // Validando os campos
    if (!nome || !email || !senha || !senhaConfirmada) {
        statusMessage.textContent = 'Por favor, preencha todos os campos.';
        statusMessage.style.color = 'red';
        return;
    }

    if (senha !== senhaConfirmada) {
        statusMessage.textContent = 'As senhas não coincidem.';
        statusMessage.style.color = 'red';
        return;
    }

    // Enviar os dados para o backend
    try {
        const response = await fetch('http://localhost:3333/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha, nome }),
        });

        const data = await response.json();

        if (response.ok) {
            // Cadastro bem-sucedido
            statusMessage.textContent = 'Cadastro bem-sucedido! Redirecionando...';
            statusMessage.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'login.html'; // Redireciona para a página de login
            }, 2000);
        } else {
            // Erro no cadastro
            statusMessage.textContent = data.message || 'Erro ao cadastrar.';
            statusMessage.style.color = 'red';
        }
    } catch (error) {
        // Erro de conexão
        statusMessage.textContent = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
        statusMessage.style.color = 'red';
        console.error('Erro:', error);
    }
}