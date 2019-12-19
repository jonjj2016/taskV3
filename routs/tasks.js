const express = require('express');
const router = express.Router();
const taskControllers = require('../controllers/taskController');
const aouthControllers = require('../controllers/authControllers');

//router.param('txt', taskControllers.checkTxt);
router.route('/top-tasks').get(aouthControllers.protect, taskControllers.aliasTopTasks, taskControllers.getAllTasks);
router
	.route('/')
	.get(aouthControllers.protect, taskControllers.getAllTasks)
	.post(aouthControllers.protect, aouthControllers.restrictTo('admin'), taskControllers.postTask);
router
	.route('/:id')
	.patch(aouthControllers.protect, aouthControllers.restrictTo('dev', 'admin'), taskControllers.updateTaskById)
	.delete(aouthControllers.protect, aouthControllers.restrictTo('dev', 'admin'), taskControllers.deleteTaskById)
	.get(aouthControllers.protect, taskControllers.getTaskById);
router.route('/filter/:txt').get(aouthControllers.protect, taskControllers.filterTasksById);
router
	.route('/updateMyCollection/:id/:stepId?/:microstepId?')
	.patch(aouthControllers.protect, taskControllers.addToUsersTask)
	.delete(aouthControllers.protect, taskControllers.deleteusersTask)
	.patch(aouthControllers.protect, taskControllers.togglingCompleted);

module.exports = router;
