const Task = require('../models/taskModel');
const APIFeatures = require('../utils/apiFeatures');
exports.aliasTopTasks = (req, res, next) => {
	req.query.limit = '5';
	//req.query.sort = 'level';
	req.query.fields = 'title,description,level';
	next();
};

exports.getAllTasks = async (req, res) => {
	try {
		const features = new APIFeatures(Task.find(), req.query).filter().sort().limitFields().paginate();
		const tasks = await features.query;
		res.status(200).json({
			status  : 'Success',
			results : tasks.length,
			data    : {
				tasks
			}
		});
	} catch (err) {
		res.status(404).json({
			status  : 'Fail',
			message : err
		});
	}
};
exports.filterTasksById = (req, res) => {
	res.status(200).json({
		status  : 'Success',
		message : 'task is fetched'
	});
};
exports.postTask = async (req, res) => {
	try {
		const task = await Task.create(req.body);
		res.status(200).json({
			status : 'Success',
			data   : {
				task
			}
		});
	} catch (err) {
		res.status(400).json({
			status  : 'Fail',
			message : err
		});
	}
};
exports.getTaskById = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);

		res.status(200).json({
			status : 'success',
			data   : {
				task
			}
		});
	} catch (err) {
		res.send(404).json({
			status  : 'Fail',
			message : err
		});
	}
};
exports.updateTaskById = async (req, res) => {
	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new           : true,
			runValidators : true
		});
		res.status(200).json({
			status : 'Success',
			data   : {
				task
			}
		});
	} catch (err) {
		res.send(404).json({
			status  : 'Fail',
			message : err
		});
	}
};
exports.deleteTaskById = async (req, res) => {
	try {
		await Task.findByIdAndRemove(req.params.id);
		res.status(204).json({
			status : 'Success',
			data   : null
		});
	} catch (err) {
		res.send(404).json({
			status  : 'Fail',
			message : err
		});
	}
};
