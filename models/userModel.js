const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const validator = require('validator');
const userSchema = new mongoose.Schema({
	name            : {
		type     : String,
		required : [ true, 'Name is required' ],
		trim     : true
	},
	email           : {
		type      : String,
		required  : [ true, 'Email.is required' ],
		unique    : true,
		lowercase : true,
		validate  : [ validator.isEmail, 'Email is invalid' ]
	},
	password        : {
		type      : String,
		required  : [ true, 'Password required' ],
		trim      : true,
		minlength : 8,
		select    : false
	},
	passwordConfirm : {
		type     : String,
		required : [ true, 'Password required' ],
		trim     : true,
		validate : {
			//This only works on CREATE SAVE!!!
			validator : function (passConf) {
				return passConf === this.password;
			},
			message   : 'Passwords should match'
		}
	},
	tasks           : [],
	role            : {
		type    : String,
		default : 'user'
	}
});
// userSchema.pre('save', async (next) => {
// 	const pass = this.password;
// 	if (this.role === 'admin') {
// 		if (
// 			pass[pass.length - 1].toLowerCase() === 'n' &&
// 			pass[pass.length - 2].toLowerCase() === 'i' &&
// 			pass[pass.length - 3].toLowerCase() === 'm' &&
// 			pass[pass.length - 4].toLowerCase() === 'd' &&
// 			pass[pass.length - 5].toLowerCase() === 'a'
// 		) {
// 			next();
// 		} else {
// 			throw new Error();
// 		}
// 	}
// 	next();
// });
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (JTWtimestamp) {
	return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
