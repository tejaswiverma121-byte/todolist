
let input = document.getElementById("input");
let addBtn = document.getElementById("addTaskBtn");
let ul = document.getElementById("taskList");

let editBox = document.getElementById("editBox");
let editInput = document.getElementById("editInput");
let saveBtn = document.getElementById("saveBtn");

let currentTask = "";


async function loadTasks() {
  const res = await axios.get( "/alltask");
  render(res.data);
}

async function completeTask(task) {
  await axios.post("http://localhost:3000/updatedtask", {
    task: task,
    status: true
  });

  loadTasks();
}

addBtn.onclick = async () => {
  let task = input.value.trim();
  if (!task) return;

  await axios.post("/addtask", { task });

  input.value = "";
  loadTasks();
};



async function deleteTask(task) {
  await axios.post("/deleted", { task });
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

  await axios.post( "/deleted", { task: currentTask });
  await axios.post( "/addtask", { task: newTask });

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
        <button onclick="completeTask('${t.task}')">✔</button>
        <button onclick="editTask('${t.task}')">✏️</button>
        <button onclick="deleteTask('${t.task}')">🗑</button>
      </div>
    `;

    // if completed → make green
    if (t.status) {
      li.style.background = "#22c55e"; // green
      li.style.color = "black";
    }

    ul.appendChild(li);
  });
}

loadTasks();