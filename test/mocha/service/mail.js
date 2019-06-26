var assert = require('assert');
var _ = require('underscore');
var message = require('../../../server/message.js');
var config = require('../../../server/config.js');
config.setup(__dirname + '/../../../conf/local.json');
var mailService = require('../../../server/service/mail.js');

describe('/service/mail.js', function() {
	describe('sendMail', function() {
		before(function (done) {
			console.log('[describe]before test')
			done();
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
			done();
		});
		it('メールが送信されること', function(done) {
			//var data = {
			//	to: 'isystk@gmail.com',
			//	subject: 'Phomixのメール送信テストです。',
			//	text: 'こんにちは。'
			//};
			//mailService.sendMail(data, function(err, result) {
			//	assert.ok(err === null);
			//	done();
			//});
		});
	});
});

