const API_URL = "http://localhost:5000/tasks";

const taskList = document.getElementById("task-list");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date");
const priorityInput = document.getElementById("priority");

let tasks = [];
let filter = "all";

// LOAD
async function loadTasks() {
  const res = await fetch(API_URL);
  tasks = await res.json();
  renderTasks();
}

// FILTER
function filterTasks(type) {
  filter = type;
  renderTasks();
}

// RENDER
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;

  if (filter === "completed") {
    filtered = tasks.filter(t => t.completed);
  } else if (filter === "pending") {
    filtered = tasks.filter(t => !t.completed);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");

    li.classList.add(task.priority);
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <b>${task.text}</b>
      <br>
      📅 ${task.dueDate || "No date"}
      <br>
      ⚡ ${task.priority}
      <br>
      <button class="delete">❌</button>
    `;

    // DELETE
    li.querySelector(".delete").onclick = async () => {
      await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
      loadTasks();
    };

    // TOGGLE
    li.querySelector("input").onchange = async () => {
      await fetch(`${API_URL}/${task.id}`, { method: "PATCH" });
      loadTasks();
    };

    taskList.appendChild(li);
  });
}

// ADD
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: taskInput.value,
      dueDate: dueDateInput.value,
      priority: priorityInput.value
    })
  });

  taskInput.value = "";
  dueDateInput.value = "";

  loadTasks();
});

// INIT
loadTasks();