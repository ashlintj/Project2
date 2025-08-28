const todoForm = document.getElementById("todoForm");
const newTaskInput = document.getElementById("newTask");
const taskList = document.getElementById("taskList");
const remainingCount = document.getElementById("remainingCount");
const filterButtons = document.querySelectorAll("#filters button");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all"; 
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(index));
    const label = document.createElement("label");
    label.textContent = task.text;
    label.addEventListener("dblclick", () => editTask(index, label));
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.className = "delete";
    deleteBtn.addEventListener("click", () => deleteTask(index));

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateCount();
}
function addTask(text) {
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
}
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}
function editTask(index, label) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].text;
  label.replaceWith(input);
  input.focus();

  const finishEdit = (save) => {
    if (save) {
      tasks[index].text = input.value.trim() || tasks[index].text;
      saveTasks();
    }
    renderTasks();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishEdit(true);
    if (e.key === "Escape") finishEdit(false);
  });
  input.addEventListener("blur", () => finishEdit(true));
}
function updateCount() {
  const activeCount = tasks.filter(t => !t.completed).length;
  remainingCount.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;
}
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = newTaskInput.value.trim();
  if (text) {
    addTask(text);
    newTaskInput.value = "";
  }
});
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTasks();
  });
});
renderTasks();
