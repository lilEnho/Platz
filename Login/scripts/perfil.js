// Variáveis para elementos do DOM
const saveButton = document.getElementById('save-button');
const usernameInput = document.getElementById('username-input');
const displaySpan = document.getElementById('id_usario');
const inputContainer = document.getElementById('input-container');

const changeNameButton = document.getElementById('usuario_botao'); // Botão Alterar Nome
const changePasswordButton = document.getElementById('senha_botao'); // Botão Alterar Senha
const inputContainerPassword = document.getElementById('input-container2');
const savePasswordButton = document.getElementById('save-password');
const passwordInput = document.getElementById('password-input');
const deleteAccountButton = document.getElementById('delete-account-button');

let userId; // Variável global para armazenar o ID do usuário
let currentName; // Armazena o nome atual do usuário
let currentPassword = ''; // Armazena a senha atual do usuário

// Exibir o campo de entrada para alteração de nome
changeNameButton.addEventListener('click', () => {
    inputContainer.style.display = 'block'; // Exibe o container de entrada
});

// Exibir o campo de entrada para alteração de senha
changePasswordButton.addEventListener('click', () => {
    inputContainerPassword.style.display = 'block'; // Exibe o container de entrada de senha
});

// Salvar o novo nome, mantendo a senha atual
saveButton.addEventListener('click', async () => {
    const newName = usernameInput.value.trim();
    if (!newName) {
        alert('Por favor, insira um nome válido.');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch(`http://localhost:3333/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome: newName, senha: currentPassword }) // Envia o nome novo e a senha atual
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o nome do usuário');
        }

        displaySpan.textContent = newName;
        currentName = newName; // Atualiza o nome atual na memória
        inputContainer.style.display = 'none'; // Esconde o container de entrada
        alert('Nome atualizado com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar o nome do usuário.');
    }
});

// Salvar a nova senha, mantendo o nome atual
savePasswordButton.addEventListener('click', async () => {
    const newPassword = passwordInput.value.trim();
    if (!newPassword) {
        alert('Por favor, insira uma senha válida.');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch(`http://localhost:3333/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome: currentName, senha: newPassword }) // Envia a senha nova e o nome atual
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar a senha.');
        }

        currentPassword = newPassword; // Atualiza a senha atual na memória
        inputContainerPassword.style.display = 'none'; // Esconde o container de entrada de senha
        alert('Senha atualizada com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar a senha.');
    }
});

// Carregar os dados do usuário ao abrir a página
document.addEventListener('DOMContentLoaded', fetchUser);

async function fetchUser() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch('http://localhost:3333/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Sua sessão expirou. Faça login novamente.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Erro ao buscar dados do usuário');
        }

        const user = await response.json();
        displaySpan.textContent = user[0].nome;
        userId = user[0].id;
        currentName = user[0].nome; // Armazena o nome atual
        currentPassword = user[0].senha || ''; // Armazena a senha atual, se fornecida
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar os dados do usuário.');
    }
}

deleteAccountButton.addEventListener('click', async () => {
    if (!confirm('Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token não encontrado');
        }

        console.log("user id excluir conta:", userId)
        const response = await fetch(`http://localhost:3333/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir a conta.');
        }

        alert('Conta excluída com sucesso!');
        localStorage.removeItem('token');
        window.location.href = 'login.html'; // Redireciona para a página de login
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir a conta.');
    }
});
