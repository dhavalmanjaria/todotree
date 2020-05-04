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