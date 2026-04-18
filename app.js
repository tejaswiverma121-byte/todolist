
const express=require('express')
// const fs=require('fs')
const path=require('path')
// const fileName=path.join(__dirname,"data","task.json")

const app=express()

app.use(express.static('public'))

const uuidv4=require('uuid').v4;

app.use(express.json());
app.use(express.urlencoded({extended:true}))

//alltask
//addtask
//multitask
//pending task
//completed task
//updated task
//deletetask

let todo=[];//this was we were storing in array


app.get('/',(req,res)=>{
    res.send("<h1>TODOS TASKS</h1>")
})

app.get('/alltask',(req,res)=>{
    res.send(todo);
})

app.post('/addtask',(req,res)=>{
    console.log(uuidv4)
    const{task}=req.body;

    for(let i of todo){
        if(task===i.task){
            res.send("Task has already exist")
            return ;
        }
    }
    const newtask={
        id:uuidv4(),//unique id
        task:task,
        date:new Date().toDateString(),
        status:false
    }
    todo.push(newtask)

    res.send({
        status:"ADDED TASK SUCCESSFULLY",
        newtask
    })
})

app.post('/multitask',(req,res)=>{
    const {task}=req.body

    for(let i of task){
        const newtask={
            id:uuidv4(),//unique id
        task:task,
        date:new Date().toDateString(),
        status:false
        }
        todo.push(newtask)
    }
    res.send({status:"success",todo})
})

app.post('/updatedtask',(req,res)=>{
    const {task,status}=req.body;

    let idx=-1;
    for(let i=0;i<todo.length;i++){
        
        if(todo[i].task===task){
            todo[i].status=true;
            idx=i;
            break;
        }
    }

    res.send({
        val:todo[idx],
        update:"updates successfully"
    })
})
    app.get('/pendingtask',(req,res)=>{
        let pending=todo.filter((i)=>i.status==false)

        res.send(pending)
    })

    app.get('/completed',(req,res)=>{
        let completed=todo.filter((i)=>i.status===true)

        res.send(completed)
    })

    app.post('/deleted',(req,res)=>{
        const {task}=req.body;
    let delet=todo.filter((i)=>task!=i.task)
    todo=delet
    res.send(todo)

    })
app.get('/gettask',(req,res)=>{
    res.send(todo);
})
app.listen(3000,()=>[
    console.log("server starts")
])