import nodemailer from 'nodemailer';

export default class Mailer {
	static async sendMail({ to, subject, body }) {
		try {
			const transporter = nodemailer.createTransport({
				host: process.env.MAIL_HOST,
				port: Number(process.env.MAIL_PORT) || 0,
				secure: false, // true for 465, false for other ports
				auth: {
					user: process.env.MAIL_EMAIL, // generated ethereal user
					pass: process.env.MAIL_PASSWORD, // generated ethereal password
				},
				tls: {
					minVersion: 'TLSv1',
					rejectUnauthorized: false,
				},
			});

			// send mail with defined transport object
			const info = await transporter.sendMail({
				from: process.env.MAIL_EMAIL, // sender address
				to, // list of receivers
				subject, // Subject line
				text: body, // plain text body
				html: body, // html body
			});

			console.log('Message sent: %s', info.messageId);
		} catch (error) {
			console.log('Problem when trying send email', error);
		}
	}
}
