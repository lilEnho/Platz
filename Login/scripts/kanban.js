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
    taskList.forEach(function(task) {
        const formattedDeadline = moment(task.deadline).format('DD/MM/YYYY');

        const columnBody = document.querySelector(`[data-coluna="${task.column}"] .task-list`);     

        if (columnBody) {
            const card =`
                <div class="card" ondblclick="editModal(${task.id})">
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
}

function createTask() {
    const newTask = {
        id: Math.floor(Math.random() * 999999999),
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        deadline: $deadLineInput.value,
        column: $columnInput.value,
    };
    taskList.push(newTask);
    generateCards();
    closeModal();
}

function editTask() {
    const task = {
        id: $idInput.value,
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        deadline: $deadLineInput.value,
        column: $columnInput.value,
    };
    
    const index = taskList.findIndex(function(task){
        return task.id == $idInput.value;
    });

    taskList[index] = task;

    generateCards();
    closeModal();
}
