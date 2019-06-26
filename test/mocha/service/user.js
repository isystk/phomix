var assert = require('assert');
var _ = require('underscore');
var message = require('../../../server/message.js');
var config = require('../../../server/config.js');
config.setup(__dirname + '/../../../conf/local.json');
var commonDao = require('../../../server/dao/common.js');
var userService = require('../../../server/service/user.js');

describe('/service/user.js', function() {
	describe('regist', function() {
		before(function (done) {
			console.log('[describe]before test')
			done();
		});
		beforeEach(function (done) {
			console.log('[it]before every test');
			var data = {
				name: 'test',
			};
			commonDao.remove('user', data, function(err, result) {
				done();
			});
		});
		afterEach(function (done) {
			console.log('[it]after every test')
			done();
		});
		after(function (done) {
			console.log('[describe]after test')
			done();
		});
		it('ユーザーネームが未入力の場合にエラーになること', function(done) {
			var data = {
				name: ''
			};
			userService.regist(data, function(err, result) {
				assert.ok(_.include(err.errors, message.ERR.USER.NAME.REQUIRE));
				done();
			});
		});
		it('パスワードが未入力の場合にエラーになること', function(done) {
			var data = {
				name: 'test',
				password: ''
			};
			userService.regist(data, function(err, result) {
				assert.ok(_.include(err.errors, message.ERR.USER.PASSWORD.REQUIRE));
				done();
			});
		});
		it('メールアドレスが未入力の場合にエラーになること', function(done) {
			var data = {
				name: 'test',
				password: 'password',
				email: ''
			};
			userService.regist(data, function(err, result) {
				assert.ok(_.include(err.errors, message.ERR.USER.EMAIL.REQUIRE));
				done();
			});
		});
		it('画像IDが不正な場合にエラーになること', function(done) {
			var data = {
				name: 'test',
				password: 'password',
				email: 'test@ise-web.com',
				imageId: commonDao.makeObjectId(9999)
			};
			userService.regist(data, function(err, result) {
				assert.ok(_.include(err.errors, message.ERR.USER.IMAGE_ID.INVALID));
				done();
			});
		});
	});
	describe('login', function() {
		before(function (done) {
			console.log('[describe]before test')
			var data = {
				name: 'test',
				password: 'password',
				email: 'test@ise-web.com'
			};
			userService.regist(data, function(err, result) {
				done();
			});
		});
		beforeEach(function (done) {
			console.log('[it]before every test');
			done();
		});
		afterEach(function (done) {
			console.log('[it]after every test')
			done();
		});
		after(function (done) {
			console.log('[describe]after test')
			var data = {
				email: 'test@ise-web.com'
			};
			commonDao.remove('user', data, function(err, result) {
				done();
			});
		});
		it('パスワードが誤っている場合にエラーになること', function(done) {
			var data = {
				email: 'test@ise-web.com',
				password: 'hogehoge'
			};
			userService.login(data.email, data.password, function(err, result) {
				assert.ok(_.include(err.errors, message.ERR.USER.PASSWORD.MISS));
				done();
			});
		});
		it('パスワードが正しい場合にエラーにならないこと', function(done) {
			var data = {
				email: 'test@ise-web.com',
				password: 'password'
			};
			userService.login(data.email, data.password, function(err, result) {
				assert.ok(err === null);
				done();
			});
		});
	});
});

