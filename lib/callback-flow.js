var _ = require("underscore-keypath");
var util = require("util");
var events = require("events");

function Flow(context, firstTask) {
	events.EventEmitter.call(this);

	if(firstTask === undefined){
		firstTask = context;
		context = this;
	}

	this._thisContext = context;
	this._tasks = [ {
		"task" : firstTask
	} ];
	this._taskIndex = -1;

	return this;
}

util.inherits(Flow, events.EventEmitter);

Flow.prototype.getContext = function(){
	return this._thisContext;
};

Flow.prototype.then = function(task) {
	this._tasks.push({
		"task" : task
	});
	return this;
};

Flow.prototype._step = function() {
	var me = this;

	this._taskIndex++;
	var prevTask = this._tasks[this._taskIndex - 1];
	var currentTask = this._tasks[this._taskIndex];
	var args = [];

	if (currentTask === undefined) {
		me.emit.apply(me, ["finish"].concat(_(prevTask).valueForKeyPath("results")));
		return;
	}

	function next() {
		var args = _.toArray(arguments);

		var error = args[0];
		var results = args.slice(1);

		if (error) {
			currentTask.error = error;
			me.emit("error", error);
		}

		else {
			currentTask.results = results;
			me._step();
		}
	}

	args = [ next ];
	if (prevTask) {
		args = prevTask.results.concat(args);
	}

	try {
		currentTask.task.apply(this._thisContext, args);
	} catch (err) {
		currentTask.error = err;
		me.emit("error", err);
	}
};

Flow.prototype._execute = function() {
	this._taskIndex = -1;
	this._step();
};

Flow.prototype.run = function() {
	setTimeout(this._execute.bind(this));
	return this;
};

module.exports = Flow;
