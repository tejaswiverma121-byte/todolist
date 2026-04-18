
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
      <span>${t.task}</span>
      <div>
        <button onclick="editTask('${t.task}')">✏️</button>
        <button onclick="deleteTask('${t.task}')">🗑</button>
      </div>
    `;

    if (t.status) {
      li.style.textDecoration = "line-through";
      li.style.opacity = "0.6";
    }

    ul.appendChild(li);
  });
}

loadTasks();