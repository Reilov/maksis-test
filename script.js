const API_URL = "https://jsonplaceholder.typicode.com";

const tasksContainer = document.getElementById("tasks");
const searchInput = document.getElementById("search");
const statusSelect = document.getElementById("status");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const empty = document.getElementById("empty");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let tasks = [];
let users = [];

loadData();

async function loadData() {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    try {
        const [todosResponse, usersResponse] = await Promise.all([
            fetch(`${API_URL}/todos`),
            fetch(`${API_URL}/users`)
        ]);
        if (!todosResponse.ok || !usersResponse.ok) {
            throw new Error("Ошибка загрузки");
        }
        tasks = (await todosResponse.json()).slice(0, 15);
        users = await usersResponse.json();
        renderTasks(tasks);
    } catch (e) {
        error.classList.remove("hidden");
    } finally {

        loading.classList.add("hidden");

    }
}

function renderTasks(list) {
    tasksContainer.innerHTML = "";
    document.getElementById("count").textContent = `Найдено задач: ${list.length}`;
    if (list.length === 0) {
        empty.classList.remove("hidden");
        return;
    }
    
    empty.classList.add("hidden");

    list.forEach(task => {
        const card = document.createElement("div");
        card.className = "task";
        card.innerHTML = `
            <h3>${task.title}</h3>
            <p>User ID: ${task.userId}</p>
            <span class="status ${task.completed ? "completed" : "not-completed"}">
                ${task.completed ? "Выполнена" : "Не выполнена"}
            </span>
        `;
        card.addEventListener("click", () => {
            openModal(task);
        });
        tasksContainer.appendChild(card);
    });
}

searchInput.addEventListener("input", filterTasks);

statusSelect.addEventListener("change", filterTasks);

function filterTasks() {
    const searchText = searchInput.value.toLowerCase();
    const status = statusSelect.value;
    const filtered = tasks.filter(task => {
        const titleMatch = task.title
            .toLowerCase()
            .includes(searchText);
        let statusMatch = true;
        if (status === "completed") {
            statusMatch = task.completed;
        }
        if (status === "notCompleted") {
            statusMatch = !task.completed;
        }
        return titleMatch && statusMatch;
    });

    renderTasks(filtered);
}

function openModal(task) {
    const user = users.find(user => user.id === task.userId);
    modalBody.innerHTML = `
        <h2>${task.title}</h2>
        <p><strong>ID:</strong> ${task.id}</p>
        <p><strong>User ID:</strong> ${task.userId}</p>
        <p>
            <strong>Статус:</strong>
            ${task.completed ? "Выполнена" : "Не выполнена"}
        </p>
        <hr>
        <p><strong>Имя:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
    `;
    modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});