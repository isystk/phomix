/**
 * @fileOverview システム設定コントローラー
 * @name system.js
 * @author Yoshitaka Ise <y-ise@ise-web.com>
 * @license
 */

var adminService = require('../service/admin');
var commonDao = require('../dao/common');

function SystemController() {
}

module.exports = new SystemController();

/**
 * レベルの一覧を取得
 * @param user
 * @param data
 */
SystemController.prototype.list = function(user, data) {
	adminService.list('system', {selector: {}, page: data.page, sort: {system: 1}}, function(err, result) {
		user.send('system.list', result);
	});
};


/**
 * レベルの保存
 * @param user
 * @param data
 */
SystemController.prototype.save = function(user, data) {
	var criteria = {};
	if (data._id === '') {
		data._id = null;
	}
	criteria._id = commonDao.ObjectID(data._id);
	delete data._id;
	adminService.save('system', criteria, data, function(err, result) {
		user.send('system.save', result);
	});
};


/**
 * レベルの削除
 * @param user
 * @param data
 */
SystemController.prototype.remove = function(user, data) {
	var criteria = {};
	criteria._id = commonDao.ObjectID(data._id);
	adminService.remove('system', criteria, function(err, result) {
		user.send('system.remove', result);
	});
};


