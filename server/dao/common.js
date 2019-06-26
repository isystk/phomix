var mongoose = require('mongoose');
var config = require('../config');
var colmap = {};
var db = {};

function CommonDao() {
	db = mongoose.connect('mongodb://'+config.mongodb.hostname+'/'+config.mongodb.database);
	var schemas = config.mongodb.schemas;
	for (var i=0,len=schemas.length; i<len; i++) {
		var schema = schemas[i];
		for (var key in schema) {
			var model = new mongoose.Schema(schema[key]);
			mongoose.model(key, model);
			colmap[key] =  mongoose.model(key);
		}
	}
}

module.exports = new CommonDao();

/**
 * オブジェクトIDを生成します。
 */
var makeObjectId = CommonDao.prototype.makeObjectId = function(id) {
	if (id) {
		return new db.mongo.ObjectID(id);
	} else {
		return new db.mongo.ObjectID();
	}
}

/**
 * 存在チェック
 * @param {String} colname コレクション名
 * @param {Object} data
 * @param {function} callback
 */
CommonDao.prototype.isExist = function(colname, id, callback) {
	var col = colmap[colname];
	if (!col) {
		return callback("no such table colname:["+colname+"]");
	}

	var data = {_id: id};
	list(colname, {where: data}, function(err, result) {
		callback(err, 0 < result.length);
	});
};


/**
 * データベース内の一件を取得
 * @param {String} colname コレクション名
 * @param {Object} data
 * @param {function} callback
 */
CommonDao.prototype.find = function(colname, data, callback) {
	var col = colmap[colname];
	if (!col) {
		return callback("no such table colname:["+colname+"]");
	}

	//console.log('検索条件', colname, data);
	col
		.findOne(data, function(err, result) {
			if (err) {
				console.log(err);
			}
			//console.log('検索結果', result);
			callback(err, result);
		});
};


/**
 * データベース内の一覧取得
 * @param {String} colname コレクション名
 * @param {Object} data
 * @param {function} callback
 */
var list = CommonDao.prototype.list = function(colname, data, callback) {
	var col = colmap[colname];

	if (!col) {
		return callback("no such table colname:["+colname+"]");
	}

	//console.log('検索条件', colname, data);
	col
		.find(data.where, data.select, {sort: data.sort, skip: data.skip, limit: data.limit}, function(err, result) {
			//console.log('検索結果', result);
			if (err) {
				console.log(err);
			}
			callback(err, result || []);
		});
};

/**
 * データベース内のデータ件数取得
 * @param {String} colname コレクション名
 * @param {Object} data
 * @param {function} callback
 */
CommonDao.prototype.count = function(colname, data, callback) {
	var col = colmap[colname];

	if (!col) {
		return callback("no such table colname:["+colname+"]");
	}

	//console.log('検索条件', colname, data);
	col
		.count(data, function(err, result) {
			//console.log('検索結果', result);
			if (err) {
				console.log(err);
			}
			callback(err, result);
		});
};

/**
 * データを更新(insert or update)
 * @param {String} colname コレクション名
 * @param {Object} criteria
 * @param {Object} data
 * @param {function} callback
 */
CommonDao.prototype.upsert = function(colname, criteria, data, callback) {
	var col = colmap[colname];

	if (!col) {
		return callback("no such table colname:["+colname+"]");
	}
	if (!data || data._id) {
		return callback("valid data:["+data+"]");
	}

	if (!criteria) {
		criteria = {};
	}
	if (!criteria._id) {
		criteria._id = makeObjectId();
		data.registTime = Date.now();
	}
	data.updateTime = Date.now();

	console.log('データ登録/更新', colname, criteria, data);
	col
		.update(criteria, {$set: data}, {upsert: true}, function(err) {

			if (err) {
				console.log(err);
			}
			if(!data._id) {
				data._id = criteria._id;
			};
			callback(err, data);
		});
};

/**
 * データを削除(delete)
 * @param {String} colname コレクション名
 * @param {Object} criteria
 * @param {function} callback
 */
CommonDao.prototype.remove = function(colname, criteria,  callback) {
	var col = colmap[colname];

	if (!col) {
		return callback("no such table colname:["+colname+"]");
	}

	console.log('データ削除', colname, criteria);
	// TODO ここでundefinedのエラーが出ているのであとで調査
	col
		.remove(criteria, function(err) {
			callback(err);
		});
};


