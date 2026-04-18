const baseURL = "http://localhost:3000";

let input = document.getElementById("input");
let addBtn = document.getElementById("addTaskBtn");
let ul = document.getElementById("taskList");

let editBox = document.getElementById("editBox");
let editInput = document.getElementById("editInput");
let saveBtn = document.getElementById("saveBtn");

let currentTask = "";


async function loadTasks() {
  const res = await axios.get(baseURL + "/alltask");
  render(res.data);
}


addBtn.onclick = async () => {
  let task = input.value.trim();
  if (!task) return;

  await axios.post(baseURL + "/addtask", { task });

  input.value = "";
  loadTasks();
};


async function completeTask(task) {
  await axios.post(baseURL + "/updatedtask", { task });
  loadTasks();
}


async function deleteTask(task) {
  await axios.post(baseURL + "/deleted", { task });
  loadTasks();
}


function editTask(task) {
  currentTask = task;
  editInput.value = task;
  editBox.classList.add("active");
}


saveBtn.onclick = async () => {
  let newTask = editInput.value.trim();
  if (!newTask) return;

  // simulate update
  await axios.post(baseURL + "/deleted", { task: currentTask });
  await axios.post(baseURL + "/addtask", { task: newTask });

  editBox.classList.remove("active");
  loadTasks();
};


function render(tasks) {
  ul.innerHTML = "";

  tasks.forEach(t => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span>${t.status ? "✔ " : ""}${t.task}</span>
      <div>
        <button class="complete">✔</button>
        <button class="edit">✏️</button>
        <button class="delete">🗑</button>
      </div>
    `;

  
    li.dataset.task = t.task;


    if (t.status) {
      li.style.background = "#22c55e";
      li.style.color = "black";
    }

    ul.appendChild(li);
  });
}


ul.addEventListener("click", async (e) => {
  let li = e.target.closest("li");
  if (!li) return;

  let task = li.dataset.task;

  if (e.target.classList.contains("complete")) {
    await completeTask(task);
  }

  if (e.target.classList.contains("delete")) {
    await deleteTask(task);
  }

  if (e.target.classList.contains("edit")) {
    editTask(task);
  }
});

loadTasks();