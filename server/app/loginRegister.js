var Deferred = require('jsdeferred').Deferred;
Deferred.define();

var LOG_TYPE = require('../logType').LOG_TYPE;
var userService = require('../service/user');
var imageService = require('../service/image');

/**
 * ユーザー新規登録
 */
function LoginRegisterControl() {
}

module.exports = new LoginRegisterControl();

/**
 * プロフィール画像登録
 * @param {Object} user
 * @param {Object} data
 */
LoginRegisterControl.prototype.registProfileImage = function(user, data) {
	// ファイルサイズチェック
	// 画像ファイルチェック

	next(function() {
		var deferred = new Deferred();
		// 画像のアップロード
		imageService.upload(data.files, function(err, result) {
			if (err) {
				user.sendError({message: err.errors});
				return;
			}
			deferred.call(result);
		});
		return deferred;
	}).next(function(data) {
		imageService.convert(data, function(err, result) {
			if (err) {
				user.sendError({message: err.errors});
				return;
			}
			user.send('loginRegister.registProfileImage', {imageId: result.imageId});
		});
	});
};

/**
 * プロフィール画像削除
 * @param {Object} user
 * @param {Object} data
 */
LoginRegisterControl.prototype.deleteProfileImage = function(user, data) {

	// ログイン済みの場合は、自分の画像IDかどうかをチェック
	// 非ログインの場合は、画像IDのユーザーがnullであることをチェック

	next(function() {
		imageService.remove(data.imageId, function(err, result) {
			if (err) {
				user.sendError({message: err.errors});
				return;
			}
			user.send('loginRegister.deleteProfileImage', {imageId: result.imageId});
		});
	});
};

/**
 * プロフィール登録
 * @param {Object} user
 * @param {Object} data
 */
LoginRegisterControl.prototype.registProfile = function(user, data) {
	next(function() {
		userService.regist(data, function(err, result) {
			if (err) {
				user.sendError({message: err.errors});
				return;
			}
			user.send('loginRegister.registProfile', {accessToken: result.accessToken});
			// ユーザーログ
			userService.log({'type': LOG_TYPE.LOGIN_REGIST.key, userId: result.userId, data:{userName: result.name}});
		});
	});
};

