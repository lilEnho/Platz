
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

function openModal(id){
    $modal.style.display = "flex";
    
    if(id){
        
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
        
    } else {
        $creationMode.style.display = "block";
        $crationModeBtn.style.display = "block";

        $editionMode.style.display = "none";
        $editionModeBtn.style.display = "none";
    }
}

function closeModal(){
    $modal.style.display = "none";
    $descriptionInput.value = "";
    $priorityInput.value = "";
    $deadLineInput.value = "";  
}

function generateCards() {
    taskList.forEach(function(task) {
        const formattedDeadline = moment(task.deadline).format('DD/MM/YYYY');

        const columnBody = document.querySelector(`[data-coluna="${task.column}"] .body`);    

         const card =`
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

        columnBody.innerHTML += card;
    });
}

function createTask() {
    const newTask = {
        id: Math.floor(Math.random() * 10000),
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
    };
    
    const index = taskList.findIndex(function(task){
        return task.id == $idInput.value;
    });

    taskList[index] = task;

    closeModal();
    generateCards();
}
