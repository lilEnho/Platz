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
const $deleteModeBtn = document.getElementById('deleteModeBtn');

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
    $deleteModeBtn.style.display = "block";
    
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
    $deleteModeBtn.style.display = "none";
}

function columnReset(){
    const columns = document.querySelectorAll('.task-list');
    columns.forEach(function(column){
        column.innerHTML = "";
    }); 
}

function generateCards() {
    columnReset();
    // Sort tasks by deadline in descending order
    taskList.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    taskList.forEach(function(task) {
        const formattedDeadline = moment(task.deadline).format('DD/MM/YYYY');

        const columnBody = document.querySelector(`[data-coluna="${task.column}"] .task-list`);     

        if (columnBody) {
            const card =`
                <div class="card ${task.priority}" id="${task.id}" ondblclick="editModal(${task.id})" draggable="true" ondragstart="dragstartHandler(event)">
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

function moveTaskColumn(id, column) {
    if (!id || !column) {
        console.error('Invalid parameters');
        return;
    }

    taskList = taskList.map(function(task) {
        if (task.id == id) {
            return {
                ...task,
                column: column,
            };
        }
        return task;
    });

    generateCards();
}


function deleteTask() {
    const taskId = $idInput.value;
    taskList = taskList.filter(task => task.id != taskId);
    generateCards();
    closeModal();
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
