const http = require('http');
const express = require('express');
const port = 3000;
const host = 'localhost'

const app = express();

let Todos = [];

app.use(express.urlencoded({ extended:true }));
app.use(express.json());

//----------------------Getting----------------------

app.get("/",(req,res)=>{
    res.send({ Todos });
});

//----------------------Posting----------------------

app.post("/",(req,res)=>{
    const body = req.body;
    if(Object.keys(body).length > 0){
        Todos.push(body);
        res.send(body);
    }
    else{
    res.status(400).send("Empty body is not allowed");
    }
});

//----------------------Deleting----------------------

app.delete('/:id', (req,res) => {
    if (Todos.length > 0) {
    const todoId = +req.params.id;
    Todos = Todos.filter((todo) => +todo.id !== todoId);
    res.send(Todos);
    }
    else {
        res.send("Todos array already empty");
    }
});

//----------------------Updating----------------------

app.put('/:id', (req,res) => {
    const todoId = +req.params.id;

    const index = Todos.findIndex((todo) => +todo.id == todoId);
    if(index > 0) {
        Todos[index] = req.body;
        res.send(Todos[index]);
    }
    else {
        res.status(404).send("No todo to update");
    }
});

app.listen(port,host,()=>{
    console.log(`Server is running on ${host} port ${port}`);
})