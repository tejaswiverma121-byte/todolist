const express = require('express')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid').v4

const fileName = path.join(__dirname, "data", "task.json")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


function readTasks() {
    const raw = fs.readFileSync(fileName, 'utf-8')

    return JSON.parse(raw)
}

function writeTasks(tasks) {
    fs.writeFileSync(fileName, JSON.stringify(tasks, null, 2))
}



app.get('/', (req, res) => {
    res.send("<h1>TODOS TASKS</h1>")
})

app.get('/alltask', (req, res) => {
    const todo = readTasks()
    res.send(todo)
})

app.post('/addtask', (req, res) => {
    const todo = readTasks()
    const { task } = req.body

    const exists = todo.some(i => i.task === task)
    if (exists) return res.send("Task already exists")

    const newTask = {
        id: uuidv4(),
        task,
        date: new Date().toDateString(),
        status: false
    }

    todo.push(newTask)
    writeTasks(todo) 

    res.send({ status: "ADDED TASK SUCCESSFULLY", newTask })
})

app.post('/multitask', (req, res) => {
    const todo = readTasks()
    const { task } = req.body  

    for (let t of task) {
        todo.push({
            id: uuidv4(),
            task: t,           
            date: new Date().toDateString(),
            status: false
        })
    }

    writeTasks(todo)  
    res.send({ status: "success", todo })
})

app.post('/updatedtask', (req, res) => {
    const todo = readTasks()
    const { task } = req.body

    const found = todo.find(i => i.task === task)
    if (!found) return res.status(404).send("Task not found")

    found.status = true
    writeTasks(todo) 

    res.send({ val: found, update: "Updated successfully" })
})

app.get('/pendingtask', (req, res) => {
    const todo = readTasks()
    res.send(todo.filter(i => i.status === false))
})

app.get('/completed', (req, res) => {
    const todo = readTasks()
    res.send(todo.filter(i => i.status === true))
})

app.post('/deleted', (req, res) => {
    let todo = readTasks()
    const { task } = req.body

    todo = todo.filter(i => i.task !== task)
    writeTasks(todo)  

    res.send(todo)
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})