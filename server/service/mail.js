/**
 * @fileOverview メール送信
 * @name mail.js
 * @author Yoshitaka Ise <y-ise@ise-web.com>
 */

var Deferred = require('jsdeferred').Deferred;
Deferred.define();

var commonDao = require('../dao/common');
var config = require('../config');
var nodemailer = require('nodemailer');

function MailService() {
}

module.exports = new MailService();

/**
 * メールを送信します。
 * @param {Object} data
 * @param {function} callback
 */
MailService.prototype.sendMail = function(data, callback) {

	var message = {
		from: config.mail.from,
		to: data.to,
		subject: data.subject,
		text: data.text
	};

	var transport = nodemailer.createTransport('SMTP', {
		host: config.mail.smtp.host,
		secureConnection: false,
		port: 25,
		auth: {
			user: config.mail.smtp.username,
			pass: config.mail.smtp.password
		}
	});

	transport.sendMail(message, function(err, responseStatus){
		transport.close();
		if (err) {
			callback(err);
			return;
		}
		callback(null, 'success');
	});
};

