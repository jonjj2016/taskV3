const mongoose = require('mongoose');
const slugify = require('slugify');

const taskModel = new mongoose.Schema({
	title       : {
		type      : String,
		unique    : true,
		trim      : true,
		required  : [ true, 'Title field must be filled' ],
		maxlength : [ 40, 'A tour must have  less or equal than 40 characters' ],
		minlength : [ 10, 'A tour must have  more or equal than 10 characters' ]
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
	steps       : [
		{
			step     : {
				type     : String,
				trim     : true,
				required : [ true, 'Step field should be filled' ]
			},
			comments : [ String ],
			complete : {
				type    : Boolean,
				default : false
			}
		}
	]
});
taskModel.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});
module.exports = Task = mongoose.model('tasks', taskModel);
