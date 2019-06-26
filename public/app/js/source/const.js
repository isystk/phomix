/**
 * 定数
 * @constructor 
 */
function Const() {

	this.SnsType = {
		TWITTER: '1',
		FACEBOOK: '2'
	};

	this.ImageType = {
		SQUARE: {suffix: 'sq'},
		HD: {suffix: 'hd'},
		SD: {suffix: 'sd'}
	};

	this.ImageSize = {
		M: {suffix: 'm', size: 400},
		L: {suffix: 'l', size: 700},
		S: {suffix: 's', size: 200}
	};

}

// フロントサイド
if (typeof window !== 'undefined') {
	App.Const = new Const();
}
// サーバーサイド
else {
	module.exports = new Const();
}

