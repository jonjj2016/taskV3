const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const userSchema = new mongoose.Schema({
	name                 : {
		type     : String,
		required : [ true, 'Name is required' ],
		trim     : true
	},
	email                : {
		type      : String,
		required  : [ true, 'Email.is required' ],
		unique    : true,
		lowercase : true,
		validate  : [ validator.isEmail, 'Email is invalid' ]
	},
	password             : {
		type      : String,
		required  : [ true, 'Password required' ],
		trim      : true,
		minlength : 8,
		select    : false
	},
	passwordConfirm      : {
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
	tasks                : [],
	role                 : {
		type    : String,
		default : 'user'
	},
	passwordResetToken   : String,
	passwordResetExpires : Date,
	passwordModifiedAt   : Date,
	active               : {
		type    : Boolean,
		default : true,
		select  : false
	}
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});
userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) {
		return next();
	}
	this.passwordModifiedAt = Date.now() - 2000;
	next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (JTWtimestamp) {
	return false;
};
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};
userSchema.updatePasswordAfter = function (JWTtime) {
	if (this.passwordModifiedAt) {
		const changedTime = parseInt(this.passwordModifiedAt.getTime() / 1000, 10);
		return JWTtime < changedTime;
	}
	return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
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
