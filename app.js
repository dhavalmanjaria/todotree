"use strict";

let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let models = require('./models')

let app = express();

// Configure express app to parse json content and form data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Configure app to serve static files from public folder
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/', (req, res, next) => {
	// Respond with index.html

    var query = models.Task.find({});

    query.exec((err, tasks) => {
        if (err) console.log(err);
        res.send({'response': 'OK', "tasks": tasks});
    });
    
});


// Create a new root level task
app.post('/api/new', (req, res, next) => {
    var newTask = new models.Task(req.body);
    
    newTask.parentId = 'ROOT';

    if (newTask.taskId == 'undefined') {
        res.status(400).send({"response": "Error: Field 'taskId' must be defined"});
    }

    if (newTask.taskId.length <= 3 && newTask.taskId >= 10) {
        res.status(400)
            .send({"response": "Error: 'taskId' must be between 3 and 10 characters"});
    }

    newTask.save()
        .then(task => {
            res.send({'response': "Task saved to DB"})
        })
        .catch(err => {
            res.status(500).send({"response":"Unable to save to DB"});
        })
    next();
});

app.route('/api/:parentId/new').post((req, res, next) => {
    var parentId = req.params.parentId;
    var newTask = new models.Task(req.body);
    
    newTask.parentId = parentId;

    models.Task.find({'taskId': parentId}).then((parentTask) => {
        models.Task.find({ 'parentId': parentId})
            .sort({'taskId': 1})
            .exec((err, subTasks) => {
                if (err) console.log(err);
                console.log("PARENT TASK:");
                console.log(parentTask);

                if (subTasks.length != 0) {
                    var lastTask = subTasks.slice(-1)[0];
                    console.log("Last task:")
                    
                    // Get the taskId of the last task
                    var lastTaskIdArr = lastTask.taskId.split('-');
                    var lastId = parseInt(lastTaskIdArr.slice(-1));
                    
                    // Increment the last number by 1 and rebuild taskId
                    // string
                    lastId = lastId + 1;
                    lastTaskIdArr[lastTaskIdArr.length - 1] = lastId;
                    var newTaskId = lastTaskIdArr.join('-');

                    console.log("New task id: " + newTaskId);
                    newTask.taskId = newTaskId;
                    newTask.parentId = parentId;
                } else {
                    newTask.taskId = parentId + '-1';
                }

                // task.children.push(newTask);
                // task.save();

                newTask.save()
                    .then(task => {
                        res.send({'response': "Task saved to DB"})
                    })
                    .catch(err => {
                        res.status(500).send({"response":"Unable to save to DB"});
                    });
            });
    });    
    })
    



app.listen(3000 ||  process.env.PORT, () => {
	console.log("Server listening on 3000. Welcome to express")
});