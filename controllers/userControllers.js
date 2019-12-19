const User = require('../models/userModel');
//User.find().then((res) => console.log(444444444444444, res));
//Rout handler for Users
exports.getAllUsers = (req, res, next) => {
	User.find()
		.then((response) => {
			//console.log(response);
			res.status(200).json({
				status : 'success',
				users  : response.length,
				data   : {
					users : response
				}
			});
		})
		.catch((err) => {
			res.status(401).json({
				status  : 'FAIL',
				message : err
			});
		});
	// console.log(555555555555555555);
	// try {
	// 	const users = await User.find();
	// 	res.status(200).json({
	// 		status  : 'success',
	// 		results : users.length,
	// 		data    : {
	// 			users
	// 		}
	// 	});
	// } catch (err) {
	// 	res.status(40).json({
	// 		status  : 'error',
	// 		message : err
	// 	});
	// }
	// 	try {
	// 		const users = await User.find();
	// 		console.log(66666666, users);
	// 		res.status(200).json({
	// 			status : 'success',
	// 			users  : users.length,
	// 			data   : {
	// 				users
	// 			}
	// 		});
	// 		console.log(555555555555555, users);
	// 	} catch (err) {
	// 		// res.status(40).json({
	// 		// 	status  : 'error',
	// 		// 	message : err
	// 		// });
	// 	}
	// };}
};
exports.createAdmin = (req, res) => {
	res.status(500).json({
		status  : 'error',
		message : 'This rout is not yet  definet'
	});
};

exports.getUserById = (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			res.status(201).json({
				status : 'Success',
				data   : {
					user
				}
			});
		})
		.catch((err) => {
			res.status(404).json({
				status  : 'Fail',
				message : 'Sorry there is no match'
			});
		});
};
exports.deleteUserById = (req, res) => {
	User.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(202).json({
				status : 'Success',
				data   : null
			});
		})
		.catch((err) => {
			res.send(404).json({
				status  : 'Fail',
				message : err
			});
		});
};
exports.updateUserById = (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true })
		.select('+passwordModifiedAt')
		.then((user) => {
			res.status(201).json({
				status : 'Success',
				data   : {
					user
				}
			});
		})
		.catch((err) => {
			res.status(401).json({
				status  : 'Fail',
				message : err
			});
		});
};
