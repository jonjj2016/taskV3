const Task = require('../models/taskModel');
const User = require('../models/userModel');
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
exports.postTask = (req, res) => {
	console.log(req.body);
	Task.create(req.body)
		.then((task) => {
			res.status(200).json({
				status : 'Success',
				data   : {
					task
				}
			});
		})
		.catch((err) => {
			return res.status(401).json({
				status  : 'Fail',
				message : err
			});
		});
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
exports.deleteusersTask = async (req, res) => {
	//1) find user
	try {
		const user = await User.findById(req.user._id);
		const tasks = JSON.parse(JSON.stringify(user.tasks));
		//console.log(111111111111, tasks.length);
		const taskIndex = tasks.findIndex((item) => item._id === req.params.id);
		tasks.splice(taskIndex, 1);
		//	console.log(2222222222, tasks.length);
		const updatedUser = await User.findByIdAndUpdate(req.user._id, { tasks: tasks });
		res.status(201).json({
			status : 'Success',
			data   : {
				user : updatedUser
			}
		});
	} catch (err) {
		res.status(400).json({
			status  : 'Fail',
			message : err
		});
	}
	//2)find task
	//3)delete task
	//4)save user
};
exports.addToUsersTask = async (req, res) => {
	if (!req.params.stepId) {
		try {
			const user = await User.findById(req.user._id);
			const task = await Task.findById(req.params.id);
			const taskCopy = await JSON.parse(JSON.stringify(task));
			const tasks = [ ...user.tasks ];
			tasks.push(taskCopy);
			const updatedUser = await User.findByIdAndUpdate(req.user._id, { tasks: tasks });
			//1) find user from db
			res.status(201).json({
				status : 'Success',
				data   : {
					user : updatedUser
				}
			});
		} catch (err) {
			res.status(404).json({
				status : 'Fail',
				data   : "Couldn't update user info"
			});
		}
	}
	//2)find task from db
	//3)copy task
	//4)update user stepId?/:microstepId
};
exports.togglingCompleted = async (req, res) => {
	if (req.params.stepId) {
		//1) find user
		try {
			const user = await User.findById(req.user._id);
			const tasks = JSON.parse(JSON.stringify(user.tasks));

			if (tasks.length > 0) {
				const taskIndex = tasks.findIndex((item) => item._id === req.params.id);
				const steps = tasks[taskIndex].steps;
				const stepIndex = steps.findIndex((item) => item._id === req.params.stepId);
				const step = steps[stepIndex];
				const microStepsIndex = step.findIndex((item) => item._id === req.params.microstepId);
				microStepsIndex[taskIndex].completed = !microStepsIndex[taskIndex].completed;
				const updatedUser = await User.findByIdAndUpdate(req.user._id, { tasks: tasks });
				res.status(201).json({
					status : 'Success',
					data   : {
						user : updatedUser
					}
				});
			}
		} catch (err) {
			res.status(400).json({
				status  : 'Fail',
				message : err
			});
		}
	}
	//1 find user
	//2 find the task
	//3 change completed to true
	//4)save user
};
