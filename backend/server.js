const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => console.log('Mongodb connection established successfully'));

todoRoutes.route('/').get((req, res, next) => {
    Todo.find((err, todos) => {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get((req, res, next) => {
    let id = req.params.id;
    Todo.findById(id, (err, todo) => {
        res.json(todo);
    });
});

todoRoutes.route('/add').post((req, res, next) => {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding was FAILED');
        });
});

todoRoutes.route('/update/:id').put((req, res, next) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (!todo) {
            res.status(404).send('data is not found');
        } else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save()
                .then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send('Update is not possible');
            });
        }
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
