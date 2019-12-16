const express = require('express');
const usersControllers = require('../controllers/userControllers');
const aouthControllers = require('../controllers/authControllers');
const router = express.Router();

router.post('/signup', aouthControllers.signup);
router.post('/login', aouthControllers.login);
router.route('/').get(aouthControllers.protect, usersControllers.getAllUsers).post(usersControllers.createUser);
router
	.route('/:id')
	.get(usersControllers.getUserById)
	.delete(usersControllers.deleteUserById)
	.patch(usersControllers.updateUserById);

module.exports = router;
