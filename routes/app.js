var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var constant = require('../public/app/js/source/const');
var config = require('../server/config');
var userService = require('../server/service/user');
var Deferred = require('jsdeferred').Deferred;
Deferred.define();

//passportのセッションを使うので
//リアライズ、デシリアライズのための関数を追記。
passport.serializeUser(function(user, done){
	done(null, user);
});
passport.deserializeUser(function(obj, done){
	done(null, obj);
});


passport.use(new TwitterStrategy({
		consumerKey: config.app.oauth.twitter.consumerKey,
		consumerSecret: config.app.oauth.twitter.consumerSecret,
		callbackURL: config.app.oauth.twitter.callbackUrl
	},
	function(accessToken, tokenSecret, profile, done) {
		passport.session.accessToken = accessToken;
		passport.session.profile = profile;
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));

passport.use(new FacebookStrategy({
		clientID: config.app.oauth.facebook.appKey,
		clientSecret: config.app.oauth.facebook.secretKey,
		callbackURL: config.app.oauth.facebook.callbackUrl
	},
	function(accessToken, refreshToken, profile, done){
		passport.session.accessToken = accessToken;
		passport.session.profile = profile;
		process.nextTick(function(){
			done(null ,profile);
		});
	}
));

exports.gets = {
	'/' : function(req, res){
		loginCheck(req, function(isLogin) {
			sendHtml(res, null, 'index', {isLogin: isLogin});
		});
	},
	'/u/:userId/' : function(req, res){
		sendHtml(res, null, 'user/index', {});
	},
	'/tag/:tagId/' : function(req, res){
		sendHtml('tag/index', {});
	},
	'/dashboard/' : function(req, res){
		loginCheck(req, function(isLogin) {
			if (!isLogin) {
				// ログインしていない場合は、ログイン画面にリダイレクトする
				res.redirect(config.app.host + '/login/');
				return;
			}
			sendHtml(res, null, 'my/dashboard/index', {});
		});
	},
	'/post/' : function(req, res){
		loginCheck(req, function(isLogin) {
			if (!isLogin) {
				// ログインしていない場合は、ログイン画面にリダイレクトする
				res.redirect(config.app.host + '/login/');
				return;
			}
			sendHtml(res, null, 'my/post/index', {});
		});
	},
	'/settings/' : function(req, res){
		loginCheck(req, function(isLogin) {
			if (!isLogin) {
				// ログインしていない場合は、ログイン画面にリダイレクトする
				res.redirect(config.app.host + '/login/');
				return;
			}
			sendHtml(res, null, 'my/settings/index', {});
		});
	},
	'/login/' : function(req, res){
		loginCheck(req, function(isLogin) {
			if (!isLogin) {
				sendHtml(res, null, 'login/index', {});
				return;
			}
			// ログイン済みの場合は、トップ画面にリダイレクトする
			res.redirect(config.app.host);
		});
	},
	'/login/register/' : function(req, res){
		loginCheck(req, function(isLogin) {
			if (!isLogin) {
				sendHtml(res, null, 'login/register/index', {});
				return;
			}
			// ログイン済みの場合は、トップ画面にリダイレクトする
			res.redirect(config.app.host);
		});
	},
	'/login/register/complete/' : function(req, res){
		loginCheck(req, function(isLogin) {
			if (!isLogin) {
				sendHtml(res, null, 'login/register/complete/index', {});
				return;
			}
			// ログイン済みの場合は、トップ画面にリダイレクトする
			res.redirect(config.app.host);
		});
	},
	'/login/identify/' : function(req, res){
		sendHtml(res, null, 'login/identify/index', {});
	},
	'/logout/' : function(req, res){
		res.clearCookie('accessToken');
		res.redirect(config.app.host);
	},
	'/login/tw/' : [passport.authenticate('twitter'), function(req, res){}],
	'/login/tw/callback/' : [passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res){
		var json = passport.session.profile._json;
		console.log(json);

		var user = {};
		user.snsType = constant.SnsType.TWITTER;
		user.snsId = json.id;
		user.snsName = json.screen_name;
		user.name = json.name;
		user.image = json.profile_image_url;

		sendHtml(res, null, 'login/register/index', user);
	}],
	'/login/fb/' : [passport.authenticate('facebook'), function(req, res){}],
	'/login/fb/callback/' : [passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res){
		var json = passport.session.profile._json;
		console.log(json);

		var user = {};
		user.snsType = constant.SnsType.FACEBOOK;
		user.snsId = json.id;
		user.snsName = json.username;
		user.name = json.name;
		user.image = 'https://graph.facebook.com/'+json.username+'/picture';

		sendHtml(res, null, 'login/register/index', user);
	}]
};

exports.posts = {};

exports.puts = {};

exports.deletes = {};

/**
 * レスポンスデータとしてHTMLを返却します
 */
function sendHtml(res, err, url, data) {
	if (!data) {
		data = {};
	}
	data.title = config.app.title;
	data.scripts = config.app.scripts;
	data.description = config.app.description;
	res.render(url, data);
	return;
}

/**
 * レスポンスデータとしてJSONを返却します
 */
function sendJson(res, err, data) {
	if (err) {
		res.send(JSON.stringify(err), 500);
		return;
	}
	res.send(JSON.stringify(data));
	return;
}

/**
 * ログインチェックを行います。
 */
function loginCheck(req, callback) {
	var accessToken = req.cookies.accessToken || '';
	if (accessToken !== '') {
		userService.getUserInfo(accessToken, function(err, result) {
			if (err || !result || !result.userId) {
				callback(false);
				return;
			}
			callback(true);
		});
		return;
	} else {
		callback(false);
	}
}

