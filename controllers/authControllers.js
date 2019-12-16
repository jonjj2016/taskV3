const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const util = require('util');
const jwt = require('jsonwebtoken');
const signToken = (id) => {
	return jwt.sign(
		{
			id : id
		},
		process.env.JWT_SECRET,
		{
			expiresIn : process.env.JWT_EXPIRES_IN
		}
	);
};
const createAndSendJWT = (user, statusCode, res) => {
	const token = signToken(user._id);
	res.status(200).json({
		status : statusCode,
		token
	});
};
const filterMyData = (body, ...rest) => {
	const filtered = {};
	Object.keys(body).forEach((item) => {
		if (rest.includes(item)) {
			filtered[item] = body[item];
		}
	});
	return filtered;
};
exports.signup = async (req, res) => {
	try {
		const newUser = await User.create(req.body);
		const token = signToken(newUser._id);
		res.status(201).json({
			status : 'Success',
			token,
			data   : {
				user : newUser
			}
		});
	} catch (err) {
		res.status(400).json({
			status  : 'Fail',
			message : err
		});
	}
};
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		//1)Checking if email and password exist
		if (!email || !password) {
			res.status(400).json({
				status  : 'Fail',
				message : 'Please provide email and password'
			});
			return next();
		}
		//2)Checking if user exist & password is correct
		const user = await User.findOne({
			email
		}).select('+password');

		if (!user || !await user.correctPassword(password, user.password)) {
			res.status(401).json({
				status  : 'Fail',
				message : 'Incorrect email or password'
			});
			return next();
		}
		//3) If everything ok send token to client
		createAndSendJWT(user, 200, res);
		// const token = signToken(user._id);
		// res.status(200).json({
		// 	status : 'Success',
		// 	token
		// });
	} catch (err) {
		res.status(400).json({
			status  : 'Fail',
			message : err
		});
	}
};
exports.protect = async (req, res, next) => {
	try {
		//1) Getting the token check if its there
		let token;

		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			token = req.headers.authorization.split(' ')[1];
		}
		//console.log(token);
		if (!token) {
			return res.status(401).json({
				status  : 'Fail',
				message : 'You are not logged in'
			});
		}

		//2)Token Verification
		const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
		const freshuUser = await User.findById(decoded.id);
		if (!freshuUser) {
			return res.status(401).json({
				status  : 'Fail',
				message : 'The user no longer exists'
			});
			next();
		}
		req.user = freshuUser;
		next();
	} catch (err) {
		res.status(400).json({
			status  : 'Fail',
			message : err
		});
	}
};
exports.restrictTo = (...roles) => {
	return async (req, res, next) => {
		if (!await roles.includes(req.user.role)) {
			return res.status(403).json({
				status  : 'Fail',
				message : 'You are not permitted to make such operations'
			});
		}
		next();
	};
};
exports.forgotPassword = async (req, res, next) => {
	//console.log(666666666);
	//1)find user
	const user = await User.findOne({ email: req.body.email });

	//2) create token and send to users email
	const resetToken = user.createPasswordResetToken();
	//console.log('resetToken', user);

	await user.save({ validateBeforeSave: false });

	//3)Send it to user
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
	const message = `Forgot your password ? Submit a PATCH requiest with your new password and confirmPassword to :${resetURL} .\n If you haven't dorgot  your password then ignore this message  `;

	try {
		await sendEmail({
			email   : user.email,
			subject : 'Your password reset token valid for 10 minutes',
			message
		});

		res.status(200).json({
			status  : 'Success',
			message : 'Your token has been sent to your email'
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await isSecureContext.save({
			validateBeforeSave : false
		});
		return res.status(500).json({
			status  : 'Fail',
			message : err
		});
	}
	next();
};
exports.resetPassword = async (req, res, next) => {
	try {
		//Get token from user
		const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
		console.log(token);

		//2 get user with token provided and check if token is valid
		const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
		//3 check if passwords match and save user password

		if (!user) {
			return res.status(400).json({
				status  : 'Fail',
				message : 'Token is invalid or has expired'
			});
		}
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		//log in user and send JWT
		createAndSendJWT(user, 200, res);
	} catch (err) {
		res.status(400).json({
			status  : 'Fail',
			message : err
		});
	}
	next();
};
exports.updatePassword = async (req, res, next) => {
	const user = await User.findById(req.user._id).select('+password');
	//compare password from body to password in DB
	const isCorrect = user.correctPassword(req.body.currentPassword, user.password);
	if (!isCorrect) {
		return res.status(404).json({
			status  : 'Fail',
			message : 'You ene=tered wrong password please try again'
		});
	}

	//update users password
	user.password = req.body.newPassword;
	user.passwordConfirm = req.body.newPasswordConfirm;
	await user.save();
	//Log user in with new JWT
	createAndSendJWT(user, 200, res);
	next();
};
exports.updateInfo = async (req, res, next) => {
	const filteredData = filterMyData(req.body, 'name', 'email');
	//creating error if user tries to update his password here at this rout
	if (req.body.password || req.user.passwordConfirm) {
		return res.status(400).json({
			status  : 'Fail',
			message : 'This rout is not for updating passwords, please use /updatePassword rout'
		});
	}
	//geting user from our Db
	const user = await User.findByIdAndUpdate(req.user._id, filteredData, { runValidators: true });
	res.status(200).json({
		status : 'Success',
		data   : user
	});
	next();
};
exports.deleteUser = async (req, res, next) => {
	//1 finding the user from db
	const user = await User.findBiIdAndUpdate(req.user._id, { active: false });
	res.status(204).json({
		status : 'Success',
		data   : null
	});
	//2 updating data so that user be inactive
	next();
};
