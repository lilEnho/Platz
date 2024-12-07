const $modal = document.getElementById('modal');
const $descriptionInput = document.getElementById('descricao');
const $priorityInput = document.getElementById('prioridade');
const $deadLineInput = document.getElementById('deadline');
const $idInput = document.getElementById('idInput');    

const $todoColumnBody = document.querySelector('#todoColumn .body');

var todoList = []

function openModal(id){
    $modal.style.display = "flex";

    if(id){
        const index = todoList.findIndex(function(task){
            return task.id === id;
        });

        if (index !== -1) {
            const task = todoList[index];

            $idInput.value = task.id;
            $descriptionInput.value = task.description;
            $priorityInput.value = task.priority;
            $deadLineInput.value = task.deadline;
        } else {
            console.error('Task not found');
        }
    }   
}

function closeModal(){
    $modal.style.display = "none";
    $descriptionInput.value = "";
    $priorityInput.value = "";
    $deadLineInput.value = "";  
}

function generateUniqueId() {
    return Math.floor(Math.random() * 10000);
}

function generateCards() {
    const todoListHtml = todoList.map(function(task) {
        const formattedDeadline = moment(task.deadline).format('DD/MM/YYYY');
         return `
            <div class="card" ondblclick="openModal(${task.id})">
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
    });

    $todoColumnBody.innerHTML = todoListHtml.join('');
}

function createTask() {
    const newTask = {
        id: generateUniqueId(),
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        deadline: $deadLineInput.value,
    };
    todoList.push(newTask);
    generateCards();
    closeModal();
}