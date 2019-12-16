const User = require('../models/userModel');

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
		console.log(454545454, req.body);
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
		const token = signToken(user._id);
		res.status(200).json({
			status : 'Success',
			token
		});
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
		console.log(decoded);
		const freshuUser = await User.findById(decoded.id);
		console.log(freshuUser);
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
