"use strict";

let mongoose = require('mongoose');
let models = require('./models.js');

var addTask = function(task, parentId) {
	tasks = models.Task;
	tasks.find(function (err, tasks) {
		if (err) return console.log(err);
		// console.log(tasks);
		return tasks;
	})
}

/**
 * Return the task's siblings and parent
 */
function getTaskFamily(task) {
	var sisterTasks = [];
	var taskId = task.taskId;
	var retval = {};
	
	return new Promise((resolve, reject) => {
		models.Task.find({'parentId': task.parentId, 'taskId': { "$ne": taskId }})
		.then(siblings => {
			siblings.forEach(sibling => {
				sisterTasks.push(sibling._doc);
			});
			retval['siblings'] = sisterTasks;
			models.Task.findOne({'taskId': `${task.parentId}` })
				.then(parent => {
					retval['parent'] = parent._doc;
					resolve(retval);
				})
				.catch(err =>{
					console.error(err.message);
					console.error(err.stack);
					retval['parent'] = null;
					resolve(retval);
				});
		})
		.catch(err => {
			console.error(err.message);
			console.error(err.stack);
			reject(err); // This could possibly be pushed upwards
		});	
	})
	
	
	return retval;
}

module.exports = {
	getTaskFamily
}