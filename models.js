"use strict";

let db = require('./database');
let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
	title: String,
	taskId: String,
	parentId: String,
	description: String,
	children: Array,
	done: Boolean,
	created: Date
}, { collection: 'tasks'} 
);

// This enables all objects to have this method and can
// be used to add depenents to a Task
taskSchema.methods.addChild = function(task) {

	title = task.title;
	description = (typeof task.description == 'undefined') ? '' : task.description;
	children = [];
	taskId = task.taskId;
	var newTask = new Task({
		title: title,
		description: description,
		children: children,
		parentId: this.taskId
	});
	this.children.push(newTask);
}


let Task = mongoose.model('Task', taskSchema);

module.exports = {
	Task
}