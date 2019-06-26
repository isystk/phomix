var Deferred = require('jsdeferred').Deferred;
Deferred.define();

var message = require('../message');
var commonDao = require('../dao/common');
var imageService = require('./image');
var passwordService = require('./password');
var accessTokenService = require('./accessToken');
var mailService = require('./mail');
var config = require('../config');
var mailTemplate = require('../mailTemplate');

function UserService() {
}

module.exports = new UserService();

/**
 * オートコンプリート用サーチを実行します
 *
 * @param data
 * @param callback
 * @return
 */
UserService.prototype.autocomplete = function(data, callback) {

	var colname = 'user';
	var term = data.term ? data.term : '';
	var size = data.size ? data.size : 10;
	var reg = data.reg ? data.reg : '';

	var field = 'name';
	if (data.field) {
		field = data.field;
	}

	if (data.reg == 'forward') { // 前方一致
		reg = new RegExp('^' + term + '.*');
	} else if (data.reg == 'exact') { // 完全一致
		reg = term;
	} else {
		reg = new RegExp('.*' + term + '.*', 'i');
	}

	var query = {};
	query[field] = reg;

	var result = { list: [] };
	commonDao.list(colname, {where: query, limit: size}, function(err, result) {
		var list = [];
		for (var i=0,len=result.length; i<len; i++) {
			var item = result[i];
			list.push({
				label: item._id + ' (' + item.name + ')',
				value: item._id
			 });
		}
		callback(null, list);
	});
};

/**
 * ユーザーログを出力します。
 *
 * @param data
 * @param callback
 * @return
 */
UserService.prototype.log = function(data, callback) {
	var log = {
		userId: data.userId,
		kind: 'activity',
		type: data.type,
		time: new Date().getTime(),
		data: data.data
	};
	commonDao.upsert('user_log', null, log, function(err, result) {
		callback(err, result);
	});
};

/**
 * ユーザーログの一覧を取得します。
 *
 * @param data
 * @param callback
 * @return
 */
UserService.prototype.loglist = function(data, callback) {
	commonDao.list('user_log', {where: data.where, sort: data.sort}, function(err, result) {
		callback(err, result);
	});
};

/**
 * ユーザー情報を新規登録します。
 * @param {Object} data
 * @param {function} callback
 */
UserService.prototype.regist = function(data, callback) {

	var user = {
		name: data.name || '',
		password: data.password || '',
		email: data.email || '',
		introduction: data.introduction || '',
		imageId: data.imageId || null,
	};

	// パスワードを暗号化する。
	if (user.password !== '') {
		user.password = passwordService.createHash(user.password);
	}

	// 入力チェック
	var errors = [];
	next(function() {
		if (!user.name || user.name === '') {
			errors.push(message.ERR.USER.NAME.REQUIRE);
		}
		if (!user.password || user.password === '') {
			errors.push(message.ERR.USER.PASSWORD.REQUIRE);
		}
		if (!user.email || user.email === '') {
			errors.push(message.ERR.USER.EMAIL.REQUIRE);
		}
	}).next(function() {
		var deferred = new Deferred();
		if (user.imageId === null) {
			deferred.call();
			return;
		}
		// 画像IDの存在チェック
		imageService.isExist(user.imageId, function(err, result) {
			if(!result) {
				errors.push(message.ERR.USER.IMAGE_ID.INVALID);
			}
			deferred.call();
		});
		return deferred;
	}).next(function() {
		var deferred = new Deferred();
		if (user.email === '') {
			deferred.call();
			return;
		}
		// メールアドレスの存在チェック
		commonDao.list('user', {where: {email: user.email}}, function(err, result) {
			if(0<result.length) {
				errors.push(message.ERR.USER.EMAIL.USED);
			}
			deferred.call();
		});
		return deferred;
	}).next(function() {
		if (0 < errors.length) {
			callback({errors: errors});
			return;
		}

		var deferred = new Deferred();

		if(user.imageId !== '') {
			user.imageId = commonDao.makeObjectId(user.imageId);
		}
		user.mailChkFlg = false;
		user.accessToken = '';
		user.registTime = Date.now();
		user.updateTime = Date.now();
		user.deleteFlg = false;

		console.log('ユーザー情報を新規登録します。', user);
		commonDao.upsert('user', null, user, function(err, result) {
			deferred.call(result);
		});

		return deferred;
	}).next(function(data) {
		var deferred = new Deferred();

		var user = data;
		user.accessToken = accessTokenService.createHash(userId);
		var userId = user._id;

		commonDao.upsert('user', {_id: userId}, {accessToken: user.accessToken}, function(err, result) {
			deferred.call(user);
		});

		return deferred;
	}).next(function(data) {
		var deferred = new Deferred();

		var user = data;

		var userId = user._id;

		if (user.imageId !== '') {
			// 画像テーブルのuserIdを更新する。
			commonDao.upsert('image', {_id: user.imageId}, {userId: userId}, function(err, result) {
				deferred.call(user);
			});
		} else {
			deferred.call(user);
		}
		return deferred;
	}).next(function(data) {

		var user = data;

		var userId = user._id;
		var email = user.email;

		if (email !== '') {
			var url = config.app.host + '/login/register/mailCheck/?_id=' + result._id;
			var text = mailTemplate.getText(mailTemplate.TEMPLATE.EMAIL_CHECK, url);
			var mailData = {
				to: email,
				subject: 'ユーザー登録が完了しました。',
				text: text
			};
			mailService.sendMail(mailData, function(err, result) {
				callback(err, {accessToken: user.accessToken});
			});
		} else {
			callback(err, {accessToken: user.accessToken, userId: user.userId, name: user.name});
		}
	});
};

/**
 * ログインしてアクセストークンを取得します。
 * @param {Object} email
 * @param {Object} password
 * @param {function} callback
 */
UserService.prototype.login = function(email, password, callback) {
	// 入力チェック
	var errors = [];
	next(function() {
		if (!email || email === '') {
			errors.push(message.ERR.USER.EMAIL.REQUIRE);
		}
		if (!password || password === '') {
			errors.push(message.ERR.USER.PASSWORD.REQUIRE);
		}
	}).next(function() {
		var deferred = new Deferred();
		// ログインチェックを行います。
		commonDao.find('user', {email: email}, function(err, result) {
			if(!result || result.length <= 0) {
				errors.push(message.ERR.USER.EMAIL.NOTEXIST);
			}
			if(result && 2<=result.length) {
				errors.push(message.ERR.SYSTEM.INVALID, '同一のEMAILを持つユーザー情報が存在します。');
			}
			if(result && !passwordService.validateHash(result.password, password)) {
				errors.push(message.ERR.USER.PASSWORD.MISS);
			}
			deferred.call(result);
		});
		return deferred;
	}).next(function(data) {

		if (0 < errors.length) {
			callback({errors: errors});
			return;
		}

		var userId = data._id;
		var accessToken = accessTokenService.createHash(userId);

		commonDao.upsert('user', {_id: userId}, {accessToken: accessToken}, function(err, result) {
			if (err) {
				callback(err, null);
				return;
			}
			callback(null, {
				userId: userId,
				name: data.name,
				accessToken: accessToken
			});
		});

	});
};

/**
 * アクセストークンからユーザー情報を取得します。
 * @param {Object} accessToken
 * @param {function} callback
 */
UserService.prototype.getUserInfo = function(accessToken, callback) {
	// 入力チェック
	var errors = [];
	next(function() {
		if (!accessToken || accessToken === '') {
			errors.push(message.ERR.USER.ACCESS_TOKEN.REQUIRE);
		}
	}).next(function() {
		var deferred = new Deferred();
		// アクセストークンからユーザー情報を取得します。
		commonDao.find('user', {accessToken: accessToken}, function(err, result) {
			if(result && 2<=result.length) {
				errors.push(message.ERR.SYSTEM.INVALID, '同一のアクセストークンを持つユーザー情報が存在します。');
			}
			deferred.call(result);
		});
		return deferred;
	}).next(function(data) {

		if (0 < errors.length) {
			callback({errors: errors});
			return;
		}

		// アクセストークンが存在しない場合
		if(!data || data.length <= 0) {
			callback(null, {});
		} else {

			var userId = data._id;

			callback(null, {
				userId: userId,
				name: data.name,
				imageId: data.imageId
			});

		}
	});
};

/**
 * パスワードリマインドメールを送信します。
 * @param {Object} email
 * @param {function} callback
 */
UserService.prototype.passwordRemind = function(email, callback) {
	// 入力チェック
	var errors = [];
	next(function() {
		if (!email || email === '') {
			errors.push(message.ERR.USER.EMAIL.REQUIRE);
		}
	}).next(function() {
		var deferred = new Deferred();
		// 存在チェックを行います。
		commonDao.find('user', {email: email}, function(err, result) {
			if(!result || result.length <= 0) {
				errors.push(message.ERR.USER.EMAIL.NOTEXIST);
			}
			deferred.call(result);
		});
		return deferred;
	}).next(function(data) {

		if (0 < errors.length) {
			callback({errors: errors});
			return;
		}

		var name = data.name;

		var onetimeData = {
			email: email,
			registTime: Date.now()
		};
		// ワンタイムパスワードを設定する。
		commonDao.upsert('onetime_password', null, onetimeData, function(err, result) {
			var url = config.app.host + '/login/identify/?_id=' + result._id;
			var text = mailTemplate.getText(mailTemplate.TEMPLATE.PASSWORD_REMIND, name, url);
			var mailData = {
				to: email,
				subject: 'パスワードをリセット',
				text: text
			};
			mailService.sendMail(mailData, function(err, result) {
				callback(err, {});
			});
		});
	});
};


