var crypto = require('crypto');
require('date-utils');

var SaltLength = 9;

function AccessToken() {
}

module.exports = new AccessToken();

AccessToken.prototype.createHash = function(userId) {
	var salt = generateSalt(SaltLength);
	var hash = md5(userId + salt);
	return salt + hash;
};

AccessToken.prototype.validateHash = function(hash, userId) {
	var salt = hash.substr(0, SaltLength);
	var validHash = salt + md5(userId + salt);
	return hash === validHash;
};

function generateSalt(len) {
	var date = new Date();
	var set = date.toFormat('YYYYMM'),
			setLen = set.length,
			salt = '';
	for (var i = 0; i < len; i++) {
		var p = Math.floor(Math.random() * setLen);
		salt += set[p];
	}
	return salt;
}

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}
 
