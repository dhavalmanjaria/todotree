"use strict";

let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let models = require('./models');
let tools = require('./tools.js');
let dbapi = require('./dbapi.js');
var cors = require('cors');

let app = express();

// Configure express app to parse json content and form data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS
app.use(cors());

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


// TODO refactoring:
// Perhaps the return value is too specific and should
// be more generic and UI agnostic so people can build different UIs
// from it.
app.route('/api/getRecentTasks').get((req, res, next) => {
	
	var retval = {};
	

	// Return most recent task, sister tasks and parent.
    models.Task.findOne({}).sort('-created')
		.then(task => {
			
			retval['task'] = task._doc;
			
			var taskFamily = dbapi.getTaskFamily(task)
				.then(family => {
					retval['siblings'] = family['siblings'];
					retval['parent'] = family['parent'];
					res.send(retval);					
				})
				.catch(err => {
					console.error(err.message);
					console.error(err.stack)
				});
			}
		)
		.catch(err => {
			console.error(err.message);
			console.error(err.stack);
			res.sendStatus(500)
				.send({"response": `Error: Could not retrieve tasks`})
		});    
});


app.route("/api/getTask/:taskId").get((req, res, next) => {
	var retval = {};
	
	models.Task.findOne({'taskId': taskId})
		.then(task => {
			retval['task'] = task._doc;
			
			var taskFamily = dbapi.getTaskFamily(task)
				.then(family => {
					retval['siblings'] = family['siblings'];
					retval['parent'] = family['parent'];
					res.send(retval);					
				})
				.catch(err => {
					console.error(err.message);
					console.error(err.stack)
				});
			}
		})
		.catch(err => {
			console.error(err.message);
			console.error(err.stack);
			res.sendStatus(500)
				.send({"response": `Error: Could not retrieve tasks`})
		});
});
		

// Create a new root level task
app.route('/api/new').post((req, res, next) => {
    var newTask = new models.Task(req.body);
    
    newTask.parentId = 'ROOT';

    if (newTask.taskId == 'undefined') {
        res.status(400).send({"response": "Error: Field 'taskId' must be defined"});
    }

    if (newTask.taskId.length <= 3 && newTask.taskId >= 10) {
        res.status(400)
            .send({"response": "Error: 'taskId' must be between 3 and 10 characters"});
    }

	newTask.created = Date.now();
    newTask.save()
        .then((task) => {
            res.send({'response': "Task saved to DB"})
        })
        .catch((err) => {
            res.status(500).send({"response":"Unable to save to DB"});
        })

});


app.route('/api/:parentId/new').post((req, res, next) => {
    var parentId = req.params.parentId;
    var newTask = new models.Task(req.body);
    
    newTask.parentId = parentId;

    models.Task.findOne({'taskId': parentId}).then((parentTask) => {
        models.Task.find({ 'parentId': parentId})
            .sort({'taskId': 1})
            .exec((err, subTasks) => {
                if (err) console.error(err);
                console.log("PARENT TASK:");
                console.log(parentTask);

                if (subTasks.length != 0) {
                    var lastTask = subTasks.slice(-1)[0];
                    
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

				newTask.created = Date.now();

				if (parentTask != null && typeof parentTask != "undefined") {
					console.log("parent: " + typeof parentTask);
					parentTask.children.push(newTask.taskId);
			        parentTask.save()
						.then(task => {
							console.log(`${newTask.taskId} added to ${parentTask.taskId}`);
						})
						.catch(err => {
							console.error("Error: Could not save parentTask children");
							console.error(err.mesasage);
						});	
				}
                newTask.save()
                    .then(task => {

                        res.send({'response': "Task saved to DB"})
                    })
                    .catch(err => {
                        res.status(500).send({"response":"Unable to save to DB"});
                    });
            });
    });    
});

app.route('/api/:taskId/edit').post((req, res, next) => {

        var taskId = req.params.taskId;
        var task = models.Task.findOne({'taskId': taskId})
			.then((task) => {
				// This will update set all of 'task's field to the new ones in req.body
	            // While also validating them.
	            var updatedFields = req.body;
				var validFields = tools.getModelFields(task);
				
	            Object.keys(updatedFields).forEach(field => {

	            	if (validFields.includes(field)) {
	                	task[field] = updatedFields[field];
	                } else {
	                	return res.send(
	                    	{"response": `Error: ${field} not found in task. Valid fields are: 
	                        	${JSON.parse(validFields)}`});
	                        }
					});

	                task.save()
						.then(task => {
	                    return res.send({"response": "Task saved."});
						})
	                    .catch(err => {
	                        console.log(err.message);
	                		return res.send({"response": "Error: Task could not be saved."});
						});
            })
			.catch(err => {
				console.error(err.message);
				console.error(err.stack);
				res.status(404).send({"response": `Task ${taskId} not found`});
			});
	});

app.route("/api/:taskId/delete").post((req, res, next) => {
	var taskId = req.params.taskId;
	models.Task.deleteOne({'taskId': taskId})
		.then((task) => {
			res.send({"response": `Task ${taskId} deleted`});
		})
		.catch(err => {
			console.error(err.message);
			console.error(err.stackTrace);
			res.sendStatus(400).send({"response": `Task ${taskId} could not be deleted`});
		});
});




app.listen(3000 ||  process.env.PORT, () => {
	console.log("Server listening on 3000. Welcome to express")
});