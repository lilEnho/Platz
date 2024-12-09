// Variáveis para elementos do DOM
const saveButton = document.getElementById('save-button');
const usernameInput = document.getElementById('username-input');
const displaySpan = document.getElementById('id_usario');
const inputContainer = document.getElementById('input-container');
const currentNameSpan = document.getElementById('current-name');
const emailspan = document.getElementById('user-email')// Adicionado para o nome atual

const changeNameButton = document.getElementById('usuario_botao'); // Botão Alterar Nome
const changePasswordButton = document.getElementById('senha_botao'); // Botão Alterar Senha
const inputContainerPassword = document.getElementById('input-container2');
const savePasswordButton = document.getElementById('save-password');
const passwordInput = document.getElementById('password-input');
const deleteAccountButton = document.getElementById('delete-account-button');
const togglePasswordVisibilityButton = document.getElementById('toggle-password-visibility');
const currentPasswordDisplay = document.getElementById('current-password-display');

let userId; // Variável global para armazenar o ID do usuário
let currentName; // Armazena o nome atual do usuário
let currentPassword = ''; // Armazena a senha atual do usuário
let currentEmail;

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

        currentName = newName; // Atualiza o nome atual na memória
        currentNameSpan.textContent = newName; // Atualiza o nome na interface
        displaySpan.textContent = newName; // Atualiza o nome no display
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
        currentName = user[0].nome; // Armazena o nome atual
        currentEmail = user[0].email;
        emailspan.textContent = currentEmail
        currentNameSpan.textContent = currentName; // Atualiza o nome na interface
        displaySpan.textContent = currentName; // Atualiza o nome no display
        userId = user[0].id;
        currentPassword = user[0].senha; // Armazena a senha atual, se fornecida
        currentPasswordDisplay.textContent = '******';  // Exibe a senha oculta por padrão
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

togglePasswordVisibilityButton.addEventListener('click', () => {
    const currentType = currentPasswordDisplay.textContent === '******' ? 'text' : 'password';

    if (currentType === 'text') {
        currentPasswordDisplay.textContent = currentPassword;  // Mostra a senha
    } else {
        currentPasswordDisplay.textContent = '******';  // Oculta a senha
    }
});

// Adicionando os eventos para o botão "Cancelar" de Nome
const cancelNameButton = document.getElementById('cancel-name-button');
cancelNameButton.addEventListener('click', () => {
    inputContainer.style.display = 'none'; // Esconde a div de alteração de nome
    usernameInput.value = ''; // Limpa o campo de entrada de nome
});

// Adicionando os eventos para o botão "Cancelar" de Senha
const cancelPasswordButton = document.getElementById('cancel-password-button');
cancelPasswordButton.addEventListener('click', () => {
    inputContainerPassword.style.display = 'none'; // Esconde a div de alteração de senha
    passwordInput.value = ''; // Limpa o campo de entrada de senha
});

