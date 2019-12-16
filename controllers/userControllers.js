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
exports.createUser = (req, res) => {
	res.status(500).json({
		status  : 'error',
		message : 'This rout is not yet  definet'
	});
};

exports.getUserById = (req, res) => {
	res.status(500).json({
		status  : 'error',
		message : 'This rout is not yet  definet'
	});
};
exports.deleteUserById = (req, res) => {
	res.status(500).json({
		status  : 'error',
		message : 'This rout is not yet  definet'
	});
};
exports.updateUserById = (req, res) => {
	res.status(500).json({
		status  : 'error',
		message : 'This rout is not yet  definet'
	});
};
