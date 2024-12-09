const $modal = document.getElementById('modal');

const $descriptionInput = document.getElementById('descricao');
const $priorityInput = document.getElementById('prioridade');
const $columnInput = document.getElementById('coluna');
const $deadLineInput = document.getElementById('deadline');
const $idInput = document.getElementById('idInput');

const $creationMode = document.getElementById('creationMode');
const $editionMode = document.getElementById('editionMode');
const $crationModeBtn = document.getElementById('creationModeBtn');
const $editionModeBtn = document.getElementById('editionModeBtn');

var taskList = []

function openModal(column){
    $modal.style.display = "flex";
    $creationMode.style.display = "block";
    $crationModeBtn.style.display = "block";
    $editionMode.style.display = "none";
    $editionModeBtn.style.display = "none";

    document.getElementById('coluna').value = column;
}

function editModal(id){
    $modal.style.display = "flex";
    $creationMode.style.display = "none";
    $crationModeBtn.style.display = "none";
    $editionMode.style.display = "block";
    $editionModeBtn.style.display = "block";

    const index = taskList.findIndex(function(task){
        return task.id == id;
    });

    const task = taskList[index];

    $idInput.value = task.id;
    $descriptionInput.value = task.description;
    $priorityInput.value = task.priority;
    $deadLineInput.value = task.deadline;
    $columnInput.value = task.column;
}

function closeModal(){
    $modal.style.display = "none";
    $descriptionInput.value = "";
    $priorityInput.value = "";
    $deadLineInput.value = "";
    $columnInput.value = "";
}

function columnReset(){
    const columns = document.querySelectorAll('.task-list');
    columns.forEach(function(column){
        column.innerHTML = "";
    });
}

function generateCards() {
    columnReset();
    console.log(taskList); // Verifique se a propriedade "column" está presente e correta
    taskList.forEach(function(task) {
        const formattedDeadline = task.deadline === "Sem deadline"
            ? "Sem deadline"  // Mantém "sem deadline" se for o valor
            : moment(task.deadline).isValid()
                ? moment(task.deadline).format('DD/MM/YYYY')  // Formata se for uma data válida
                : "Data inválida";  // Para o caso de dados inválidos

        console.log(task.coluna)
        // Valores válidos para a coluna (números como string)
        const validValues = ["1", "2", "3", "4"];

        if (!validValues.includes(task.column)) {
            // Se a coluna for "To Do", mapeia para "1"
            if (task.column === "To Do") {
                task.column = "1";
            }
            // Se a coluna for "In Progress", mapeia para "2"
            else if (task.column === "In Progress") {
                task.column = "2";
            }
            // Se a coluna for "Finished", mapeia para "3"
            else if (task.column === "Finished") {
                task.column = "3";
            }
            // Se a coluna for "Archived", mapeia para "4"
            else if (task.column === "Archived") {
                task.column = "4";
            }
        }

// Agora task.column deve ter um valor entre "1" a "4"


        const columnBody = document.querySelector(`[data-coluna="${task.column}"] .task-list`);

        console.log(columnBody)

        if (columnBody) {
            const card =`
                <div class="card" id="${task.id}" ondblclick="editModal(${task.id})" draggable="true" ondragstart="dragstartHandler(event)">
                    <div class="info">
                        <b>Descrição</b>
                        <span>${task.description}</span>
                    </div>

                    <div class="info">
                        <b>Prioridade</b>
                        <span>${task.priority}</span>
                    </div>

                    <div class="info">
                        <b>Deadline</b>
                        <span>${formattedDeadline}</span>
                    </div>
                </div>
            `;

            columnBody.innerHTML += card;
        } else {
            console.error(`Column body not found for column: ${task.column}`);
        }
    });

    // Adicionar eventos de drop às colunas
    const columns = document.querySelectorAll('.task-list');
    columns.forEach(function(column) {
        column.addEventListener('dragover', dragoverHandler);
        column.addEventListener('drop', dropHandler);
    });
}

function createTask() {
    const newTask = {
        id: Math.floor(Math.random() * 999999999), // Gerar ID manualmente
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        deadline: $deadLineInput.value || "Sem deadline",  // Define valor padrão se não houver data
        column: $columnInput.value, // 'coluna' no backend
    };

    // Exibir a tarefa no frontend
    taskList.push(newTask);
    generateCards();
    closeModal();

    // Enviar a tarefa para o backend
    const token = localStorage.getItem('token');
    fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id: newTask.id, // Enviar o ID gerado
            description: newTask.description,
            priority: newTask.priority,
            deadline: newTask.deadline,  // Envia "sem deadline" ou a data fornecida
            coluna: newTask.column, // A coluna no backend é 'coluna'
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Tarefa criada no backend:', data);
        })
        .catch(error => {
            console.error('Erro ao criar tarefa no backend:', error);
        });
}




function editTask() {
    const task = {
        id: $idInput.value,
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        deadline: $deadLineInput.value || "Sem deadline", // Definindo "Sem deadline" se estiver vazio
        column: $columnInput.value,
    };

    const index = taskList.findIndex(function(task) {
        return task.id == $idInput.value;
    });

    // Atualiza o taskList localmente
    taskList[index] = task;

    generateCards();  // Regenera os cartões na interface
    closeModal();  // Fecha o modal

    // Envia a requisição PUT para o backend
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3333/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            description: task.description,
            priority: task.priority,
            deadline: task.deadline,
            coluna: task.column, // Envia a coluna como 'coluna'
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Tarefa editada no backend:', data);
        })
        .catch(error => {
            console.error('Erro ao editar tarefa no backend:', error);
        });
}


function moveTaskColumn(id, column) {
    if (!id || !column) {
        console.error('Invalid parameters');
        return;
    }

    // Encontre a tarefa a ser movida
    const task = taskList.find(t => t.id == id);
    if (!task) {
        console.error('Tarefa não encontrada');
        return;
    }

    // Atualize apenas a coluna
    const updatedTask = {
        ...task,
        column: column
    };

    // Atualiza o taskList localmente
    taskList = taskList.map(t => (t.id == id ? updatedTask : t));

    generateCards();  // Regenera os cartões na interface

    // Envia a requisição PUT para o backend
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3333/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            description: task.description,  // Mantém a descrição atual
            priority: task.priority,        // Mantém a prioridade atual
            deadline: task.deadline,        // Mantém o deadline atual
            coluna: column,                 // Atualiza a coluna no backend
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Tarefa editada no backend:', data);
        })
        .catch(error => {
            console.error('Erro ao editar tarefa no backend:', error);
        });
}



function dragstartHandler(ev) {
    ev.dataTransfer.setData("data", ev.target.getAttribute('id'));
    ev.dataTransfer.effectAllowed = "move";
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    ev.preventDefault();
    const task_id = ev.dataTransfer.getData("data");
    const column_id = ev.target.parentElement.getAttribute('data-coluna');
    moveTaskColumn(task_id, column_id);
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Recupera o token do usuário

    if (!token) {
        // Se o token não estiver presente, redireciona para a página de login
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3333/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
            },
        });

        if (response.ok) {
            const tasks = await response.json();

            console.log("Tarefas carregadas do backend:", tasks);

            // Mapeia os campos do backend para os campos esperados pelo frontend
            taskList = tasks.map(task => ({
                ...task,
                column: task.coluna, // Transforma "coluna" em "column"
            }));

            console.log("Tarefas adaptadas para o frontend:", taskList);

            // Gera os cartões com base no taskList atualizado
            generateCards();
        } else {
            console.error('Erro ao carregar tarefas:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao se comunicar com o servidor:', error);
    }
});
