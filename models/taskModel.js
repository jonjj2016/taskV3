const mongoose = require('mongoose');
const slugify = require('slugify');
const microStep = new mongoose.Schema({
	step      : {
		type     : String,
		trim     : true,
		required : [ true, 'Step field should be filled' ]
	},
	comments  : String,
	completed : {
		type    : Boolean,
		default : false
	}
});
const step = new mongoose.Schema({
	step_title  : {
		//index    : { unique: false },
		unique   : false,
		type     : String,
		trim     : true,
		required : [ true, 'Title field must be filled' ]
	},
	description : {
		type     : String,
		trim     : true,
		required : [ true, 'Description field must be filled' ]
	},

	createdAt   : {
		type    : Date,
		default : Date.now()
	},
	progress    : {
		type    : Number,
		default : 0
	},
	completed   : {
		type    : Boolean,
		default : false
	},
	microSteps  : [ microStep ]
});
const taskModel = new mongoose.Schema({
	title       : {
		type      : String,
		unique    : false,
		//index     : { unique: false },
		trim      : true,
		required  : [ true, 'Title field must be filled' ],
		maxlength : [ 60, 'A task name have  less or equal than 40 characters' ],
		minlength : [ 10, 'A task name have  more or equal than 10 characters' ]
	},
	description : {
		type     : String,
		trim     : true,
		required : [ true, 'Description field must be filled' ]
	},
	level       : {
		type     : String,
		required : [ true, 'Level should be clicked' ],
		enum     : {
			values  : [ 'easy', 'medium', 'difficult' ],
			message : 'The Level must be one of these: easy/medium/difficult'
		}
	},
	createdAt   : {
		type    : Date,
		default : Date.now()
	},
	steps       : [ step ]
});
taskModel.pre('save', function (next) {
	this.slug = slugify(this.title, { lower: true });
	next();
});
taskModel.pre('save', function (next) {
	if (this.progress === 100) this.completed = true;
	next();
});
module.exports = Task = mongoose.model('Tasks', taskModel);
