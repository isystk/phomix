var Deferred = require('jsdeferred').Deferred;
Deferred.define();
var constant = require('../../public/app/js/source/const');
var commonDao = require('../dao/common');
var config = require('../config');
var fs = require('fs');
var im = require('imagemagick');

function ImageService() {
}

module.exports = new ImageService();

/**
 * 画像パスを取得します
 *
 * @param imageId
 * @param imageType
 * @param imageSize
 * @return
 */
var getImage = ImageService.prototype.getImage = function(imageId, imageType, imageSize) {
	if (!imageId) {
		callback({errors:['引数不正']});
	}
	var type = '';
	if (imageType) {
		type = imageType.suffix || '';
		if (type !== '') {
			type = '_' + type;
		}
	}
	var size = '';
	if (imageSize) {
		size = imageSize.suffix || '';
		if (size !== '') {
			size = '_' + size;
		}
	}
	var dir1 = imageId.substr(0,2);
	var dir2 = imageId.substr(2,2);
	var dir3 = imageId.substr(4,2);
	var dirPath = dir1 + '/' + dir2 + '/' + dir3 + '/';
	var imageDir = config.thumbDir + dirPath;
	var imagePath = imageDir + imageId + type + size + '.jpg';
	var imageUrl = config.app.host + '/img/thumb/' + dirPath + imageId + type + size + '.jpg';
	return {
		imageId: imageId,
		imageDir: imageDir,
		imagePath: imagePath,
		imageUrl: imageUrl
	};
};

/**
 * Offers functionality similar to mkdir -p
 *
 * Asynchronous operation. No arguments other than a possible exception
 * are given to the completion callback.
 */
function mkdir_p(path, mode, callback, position) {
	mode = mode || 0777;
	position = position || 0;
	parts = require('path').normalize(path).split('/');

	if (position >= parts.length) {
		if (callback) {
			return callback();
		} else {
			return true;
		}
	}

	var directory = parts.slice(0, position + 1).join('/');
	fs.stat(directory, function(err) {
		if (err === null) {
			mkdir_p(path, mode, callback, position + 1);
		} else {
			fs.mkdir(directory, mode, function (err) {
				if (err) {
					if (callback) {
						return callback(err);
					} else {
						throw err;
					}
				} else {
					mkdir_p(path, mode, callback, position + 1);
				}
			});
		}
	});
}

/**
 * 画像アップロード処理を行います
 *
 * @param files
 * @param callback
 * @return
 */
ImageService.prototype.upload = function(files, callback) {

	if(!files){
		callback({errors:['画像ファイルが不正です。']});
		return;
	}

	var imgStructure = files.split(',');
	var file = imgStructure[1];

	var imageId = commonDao.makeObjectId() + '';
	var image = getImage(imageId);

	// アップロード先のディレクトリが存在しない場合は作成します。
	if(!fs.existsSync(image.imageDir)) {
		mkdir_p(image.imageDir, null, function() {
			execUpload(file);
		});
	} else {
		execUpload(file);
	}

	// 画像をアップロードします。
	function execUpload(file) {

		var originalPath = getImage(imageId).imagePath;
		console.log('画像をアップロードします。(オリジナル)', originalPath);

		fs.writeFileSync(
			originalPath,
			new Buffer(file, 'base64')
		);

		im.identify(originalPath, function(err, imageData){
			if(err){
				callback({errors:['画像データ取得エラー']});
				return;
			}
			imageData.imageId = imageId;
			callback(null, imageData);
		});
	}
};

/**
 * 画像変換処理を行います
 *
 * @param data
 * @param callback
 * @return
 */
ImageService.prototype.convert = function(data, callback) {

	var imageId = data.imageId;

	next(function() {
		var deferred = new Deferred();
		var count = Object.keys(constant.ImageSize).length;
		for (var imageSizeKey in constant.ImageSize) {
			var imageSize = constant.ImageSize[imageSizeKey];
			resizeImage(imageId, imageSize, function() {
				count--;
				if (count <= 0) {
					deferred.call();
				}
			});
		}
		return deferred;
	}).next(function() {
		var imageEntity = {
			userId: data.userId || null,
			displayFlg: true,
			registTime: Date.now(),
			updateTime: Date.now(),
			deleteFlg: false
		};
		console.log('画像データを登録します');
		commonDao.upsert('image', {_id: imageId}, imageEntity, function(err, result) {
			if(err){
				callback({errors:['画像データ登録エラー']});
				return;
			}
			return callback(null, {imageId: result._id});
		});
	});

	// 画像をリサイズします
	function resizeImage (imageId, imageSize, callback) {
		var originalPath = getImage(imageId).imagePath;
		im.identify(originalPath, function(err, imageData){
			if(err){
				callback({errors:['画像データ取得エラー']});
				return;
			}

			// 縦長かどうか
			var isLongwise = (imageData.width < imageData.height);

			var size = '';
			if (isLongwise) {
				size = 'x'+imageSize.size;
			} else {
				size = imageSize.size+'x';
			}

			var imagePathBase = getImage(imageId, '', imageSize).imagePath;
			console.log('画像リサイズ', originalPath, '-resize', size, imagePathBase);
			im.convert([originalPath, '-resize',  size, imagePathBase], function(err, stdout){
				if(err){
					callback({errors:['画像リサイズエラー']});
					return;
				}

				var imagePathBase = getImage(imageId, '', imageSize).imagePath;
				im.identify(imagePathBase, function(err, imageData){
					if(err){
						callback({errors:['画像データ取得エラー']});
						return;
					}

					var count = Object.keys(constant.ImageType).length;
					for (var imageTypeKey in constant.ImageType) {
						var imageType = constant.ImageType[imageTypeKey];

						// 縦長かどうか
						var isLongwise = (imageData.width < imageData.height);

						if (isLongwise) {
							addSpaceImage(imagePathBase, imageId, imageData, imageSize, imageType, function(err, result) {
								if(err){
									callback(err);
									return;
								}
								count--;
								if (count <= 0) {
									callback(null, {});
								}
							});
						} else {
							cropImage(imagePathBase, imageId, imageData, imageSize, imageType, function(err, result) {
								if(err){
									callback(err);
									return;
								}
								count--;
								if (count <= 0) {
									callback(null, {});
								}
							});
						}
					}
				});
			});

		});
	}

	// 画像の左右に余白をつける
	function addSpaceImage (imagePathBase, imageId, imageData, imageSize, imageType, callback) {
		// 縦長かどうか
		var isLongwise = (imageData.width < imageData.height);
		if (!isLongwise) {
			callback({errors:['横長の画像は、左右に余白をつける必要がありません。']});
			return;
		}

		var imagePath = getImage(imageId, imageType, imageSize).imagePath;

		var width = '';
		if (isLongwise) {
			if (imageType.suffix === constant.ImageType.SQUARE.suffix) {
				width = Math.floor(imageSize.size*imageData.width/imageData.height);
			} else if (imageType.suffix === constant.ImageType.HD.suffix) {
				width = Math.floor(imageSize.size/16*9*imageData.width/imageData.height);
			} else if (imageType.suffix === constant.ImageType.SD.suffix) {
				width = Math.floor(imageSize.size/4*3*imageData.width/imageData.height);
			}
		}

		console.log('画像リサイズ', imagePathBase, '-resize', width + 'x', imagePath);
		im.convert([imagePathBase, '-resize',  width + 'x', imagePath], function(err, stdout){

			var size = Math.floor((imageSize.size - width) / 2) + 'x';

			console.log('画像余白追加', imagePath, '-background', '#e2ddd4', '-gravity', 'west', '-splice', size, imagePath);
			im.convert([imagePath, '-background', '#e2ddd4', '-gravity', 'west', '-splice', size, imagePath], function(err, stdout){
				console.log('画像余白追加', imagePath, '-background', '#e2ddd4', '-gravity', 'east', '-splice', size, imagePath);
				im.convert([imagePath, '-background', '#e2ddd4', '-gravity', 'east', '-splice', size, imagePath], function(err, stdout){
					if(err){
						callback({errors:['画像切り取りエラー']});
						return;
					}
					return callback(null, {});
				});
			});

		});
	}

	// 画像を切り取ります
	function cropImage (imagePathBase, imageId, imageData, imageSize, imageType, callback) {
		// 縦長かどうか
		var isLongwise = (imageData.width < imageData.height);
		if (isLongwise) {
			callback({errors:['縦長の画像は、切り取る必要がありません。']});
			return;
		}

		var imagePath = getImage(imageId, imageType, imageSize).imagePath;

		var size = '';
		var crop = '';
		if (imageType.suffix === constant.ImageType.SQUARE.suffix) {
			size = imageData.height + 'x' + imageData.height;
			crop = '+' + Math.floor((imageData.width-imageData.height)/2) + '+' + 0;
		} else if (imageType.suffix === constant.ImageType.HD.suffix) {
			var width = Math.floor(imageData.height/9*16);
			if (imageData.width < width) {
				size = imageData.width + 'x' + Math.floor(imageData.width/16*9);
				crop = '+' + 0 + '+' + Math.floor((imageData.height-Math.floor(imageData.width/16*9))/2);
			} else {
				size = width + 'x' + imageData.height;
				crop = '+' + Math.floor((imageData.width-width)/2) + '+' + 0;
			}
		} else if (imageType.suffix === constant.ImageType.SD.suffix) {
			var width = Math.floor(imageData.height/3*4);
			if (imageData.width < width) {
				size = imageData.width + 'x' + Math.floor(imageData.width/4*3);
				crop = '+' + 0 + '+' + Math.floor((imageData.height-Math.floor(imageData.width/4*3))/2);
			} else {
				size = width + 'x' + imageData.height;
				crop =  '+' + Math.floor((imageData.width-width)/2) + '+' + 0;
			}
		}

		console.log('画像切り取り', '-crop',  size + crop, imagePathBase, imagePath);
		im.convert(['-crop',  size + crop, imagePathBase, imagePath],
			function(err, stdout){
				if(err){
					callback({errors:['画像切り取りエラー']});
					return;
				}
				return callback(null, {});
			}
		);
	}

};

/**
 * 画像削除処理を行います
 *
 * @param imageId
 * @param callback
 * @return
 */
ImageService.prototype.remove = function(imageId, callback) {

	next(function() {
		var deferred = new Deferred();
		console.log('画像データを削除します');
		commonDao.remove('image', {_id: imageId}, function(err, result) {
			if(err){
				callback({errors:['画像データ削除エラー']});
				return;
			}
			deferred.call();
		});
		return deferred;
	}).next(function() {
		deleteImage(imageId, function(err) {
			if(err){
				callback({errors:['画像ファイル削除エラー']});
				return;
			}
			return callback(null, {});
		});
	});

	// 画像を削除します
	function deleteImage (imageId, callback) {
		var originalPath = getImage(imageId).imagePath;
		if(fs.existsSync(originalPath)) {
			fs.unlinkSync(originalPath);
		}
		for (var imageSizeKey in constant.ImageSize) {
			var imageSize = constant.ImageSize[imageSizeKey];
			var imagePathBase = getImage(imageId, '', imageSize).imagePath;
			if(fs.existsSync(imagePathBase)) {
				fs.unlinkSync(imagePathBase);
			}
			for (var imageTypeKey in constant.ImageType) {
				var imageType = constant.ImageType[imageTypeKey];
				var imagePathBase2 = getImage(imageId, imageType, imageSize).imagePath;
				if(fs.existsSync(imagePathBase2)) {
					fs.unlinkSync(imagePathBase2);
				}
			}
		}
		callback(null, {});
	}

};

/**
 * 画像IDの存在チェック処理を行います
 *
 * @param imageId
 * @param callback
 * @return
 */
ImageService.prototype.isExist = function(imageId, callback) {
	next(function() {
		commonDao.isExist('image', imageId, function(err, result) {
			if(err){
				callback({errors:['画像データ削除エラー']});
				return;
			}
			callback(null, result);
		});
	});
};


