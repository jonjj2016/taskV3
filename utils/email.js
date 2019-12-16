const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
	console.log(options);
	try {
		//1)Create transporter
		const transporter = nodemailer.createTransport({
			host : process.env.EMAIL_HOST,
			port : process.env.EMAIL_PORT,
			auth : {
				user : process.env.EMAIL_USERNAME,
				pass : process.env.EMAIL_PASSWORD
			}
		});
		//DEFINE OPTIOS
		const mailOptions = {
			from    : 'Jon Martirosyan',
			to      : options.email,
			subject : options.subject,
			text    : options.message
			//html
		};
		//3 Actually send the email
		await transporter.sendMail(mailOptions);
	} catch (err) {
		console.log(err);
	}
};
module.exports = sendEmail;
