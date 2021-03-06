const express = require('express');
const usersControllers = require('../controllers/userControllers');
const aouthControllers = require('../controllers/authControllers');
const router = express.Router();

router.post('/login', aouthControllers.login);
router.post('/signup', aouthControllers.signup);
router.route('/').get(aouthControllers.protect, aouthControllers.restrictTo('admin'), usersControllers.getAllUsers);
router.post('/forgotPassword', aouthControllers.forgotPassword);
router.patch('/resetPassword/:token', aouthControllers.resetPassword);
router.patch('/updatePassword', aouthControllers.protect, aouthControllers.updatePassword);
router.patch('/updateInfo', aouthControllers.protect, aouthControllers.updateInfo);
router.delete('/deleteUser', aouthControllers.protect, aouthControllers.deleteUser);

router
	.route('/:id')
	.get(aouthControllers.protect, aouthControllers.restrictTo('admin'), usersControllers.getUserById)
	.delete(aouthControllers.protect, aouthControllers.restrictTo('admin'), usersControllers.deleteUserById)
	.patch(aouthControllers.protect, aouthControllers.restrictTo('admin'), usersControllers.updateUserById);

module.exports = router;
