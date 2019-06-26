
function LogType() {
	this.LOG_TYPE = {
		LOGIN: {key:'login', value:'ログイン', init: true},
		LOGIN_PASSWORD_REMIND: {key:'loginPasswordRemind', value:'パスワードリマインド', init: false},
		LOGIN_REGIST: {key:'loginRegist', value:'ユーザー新規登録', init: true}
	};
}

module.exports = new LogType();

