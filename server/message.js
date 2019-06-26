/**
 * メッセージ
 */
function Message() {

	this.ERR = {};
	this.ERR.SYSTEM = {};
	this.ERR.SYSTEM.INVALID = 'システムエラーが発生しました。';
	this.ERR.USER = {};
	this.ERR.USER.NAME = {};
	this.ERR.USER.NAME.REQUIRE = 'ユーザーネームは必須です';
	this.ERR.USER.PASSWORD = {};
	this.ERR.USER.PASSWORD.REQUIRE = 'パスワードは必須です';
	this.ERR.USER.PASSWORD.MISS = '入力されたパスワードに誤りがあります。';
	this.ERR.USER.EMAIL = {};
	this.ERR.USER.EMAIL.REQUIRE = 'メールアドレスは必須です';
	this.ERR.USER.EMAIL.USED = 'メールアドレスは既に利用されています。';
	this.ERR.USER.EMAIL.NOTEXIST = '入力されたメールアドレスは登録されていません。';
	this.ERR.USER.IMAGE_ID = {};
	this.ERR.USER.IMAGE_ID.INVALID = '画像IDが不正です';

}

module.exports = new Message();

