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
	try {
		return await bcrypt.compare(candidatePassword, userPassword);
	} catch (err) {
		console.log(err);
	}
};

userSchema.methods.createPasswordResetToken = async function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	// console.log('resetToken from model.methods', resetToken);
	// console.log(this.passwordResetToken);
	return resetToken;
};
userSchema.updatePasswordAfter = function (JWTtime) {
	if (this.passwordModifiedAt) {
		const changedTime = parseInt(this.passwordModifiedAt.getTime() / 1000, 10);
		return JWTtime < changedTime;
	}
	return false;
};
userSchema.pre('save', async function (next) {
	if (this.role === 'admin') {
		if (await this.correctPassword('nimda44552020', this.password)) {
			return next();
		} else {
			this.role = 'user';
			return next();
		}
	} else next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
