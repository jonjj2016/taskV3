const express = require('express');
const router = express.Router();
const taskControllers = require('../controllers/taskController');
const aouthControllers = require('../controllers/authControllers');

//router.param('txt', taskControllers.checkTxt);
router.route('/top-tasks').get(aouthControllers.protect, taskControllers.aliasTopTasks, taskControllers.getAllTasks);
router.route('/').get(aouthControllers.protect, taskControllers.getAllTasks).post(taskControllers.postTask);
router
	.route('/:id')
	.get(aouthControllers.protect, taskControllers.getTaskById)
	.patch(aouthControllers.protect, aouthControllers.restrictTo('dev', 'admin'), taskControllers.updateTaskById)
	.delete(aouthControllers.protect, aouthControllers.restrictTo('dev', 'admin'), taskControllers.deleteTaskById);
router.route('/filter/:txt').get(taskControllers.filterTasksById);
module.exports = router;
