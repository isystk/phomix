var Deferred = require('jsdeferred').Deferred;
Deferred.define();

var LOG_TYPE = require('../logType').LOG_TYPE;
var userService = require('../service/user');

/**
 * ログイン
 */
function LoginControl() {
}

module.exports = new LoginControl();


/**
 * ログイン処理
 * @param {Object} user
 * @param {Object} data
 */
LoginControl.prototype.login = function(user, data) {
	next(function() {
		var deferred = new Deferred();
		// ログインチェックを行います。
		userService.login(data.email, data.password, function(err, result) {
			if (err) {
				user.sendError({message: err.errors});
				return;
			}
			deferred.call(result);
		});
		return deferred;
	}).next(function(data) {
		user.send('login.login', {accessToken: data.accessToken});

		// ユーザーログ
		userService.log({'type': LOG_TYPE.LOGIN.key, userId: data.userId, data:{userName: data.name}});
	});
};

/**
 * 自動ログイン処理
 * @param {Object} user
 * @param {Object} data
 */
LoginControl.prototype.autoLogin = function(user, data) {

	next(function() {
		var deferred = new Deferred();
		// ログインチェックを行います。
		userService.getUserInfo(data.accessToken, function(err, result) {
			if (err) {
				user.sendError({message: err.errors});
				return;
			}
			deferred.call(result);
		});
		return deferred;
	}).next(function(data) {
		if (data) {
			user.send('common.autoLogin', {userId: data.userId, name: data.name, imageId: data.imageId});
		} else {
			user.send('common.autoLogin', {});
		}

	});
};

/**
 * パスワードリマインドメール送信処理
 * @param {Object} user
 * @param {Object} data
 */
LoginControl.prototype.passwordRemind = function(user, data) {

	next(function() {
		var deferred = new Deferred();
		// パスワードリマインドメールを送信します。
		userService.passwordRemind(data.email, function(err, result) {
			if (err) {
				user.sendError({message: err.errors});
				return;
			}
			deferred.call(result);
		});
		return deferred;
	}).next(function(data) {
		user.send('login.passwordRemind', {});
		userService.log({'type': LOG_TYPE.LOGIN_PASSWORD_REMIND.key, email: data.email, data:{}});

	});
};


