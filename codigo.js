const input = document.querySelector("#inputField");
const taskList = document.querySelector("#task-list");
let tasks = [];

eventListeners();

function eventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        createHTML();
    })

    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete")) {
            const taskId = e.target.closest("li").getAttribute("task-id");
            deleteTask(taskId);
        }
    });
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    createHTML();
    sincrolocalStorage();
}


function addTasks() {
    const task = input.value.trim();
    if (task === "") {
        showError("El campo está vacío...");
        return;
    }

    const taskObj = {
        task,
        id: Date.now(),
        completed: false
    };
    tasks.push(taskObj);

    createHTML();
    input.value = "";
}

function completedTask(taskId) {
    tasks.forEach(task => {
        if (task.id === taskId) {
            task.completed = true;
        }
    });
    createHTML();
    sincrolocalStorage();
}


function createHTML() {
    clearHTML();

    if (tasks.length > 0) {
        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            if (task.completed) {
                li.classList.add("completed");
            }
            li.innerHTML = `
            <div class="row">
            <div class="col-10">
                <span>${task.task}</span>
            </div>
            <div class="col-2">
                <button onclick="completedTask(${task.id})" class="edit btn btn-outline-success" type="button">Completed</button>
                <button onclick="deleteTask(${task.id})" class="delete btn btn-danger fa fa-trash"></button>
            </div>
            </div>`;
            li.setAttribute("task-id", task.id);

            taskList.insertBefore(li, taskList.firstChild);
        });
    } else {
        const noTaskMessage = document.createElement("h3");
        noTaskMessage.classList.add("noTask", "text-center");
        noTaskMessage.textContent = "No hay tareas...";
        taskList.appendChild(noTaskMessage);
    }

    sincrolocalStorage();

    if (tasks.length > 10) {
        taskList.style.overflowY = "auto";
        taskList.style.maxHeight = "600px";
    }
}

function sincrolocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function showError(error) {
    const messageError = document.createElement("p");
    messageError.textContent = error;
    messageError.classList.add("error");

    taskList.appendChild(messageError);
    setTimeout(() => {
        messageError.remove();
    }, 2000);
}

function clearHTML() {
    taskList.innerHTML = "";
}