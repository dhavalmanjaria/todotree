let models = require('./models/models.js');

models.Task.find({}, function(err, task) { console.log(
'WHAT?'
); });
