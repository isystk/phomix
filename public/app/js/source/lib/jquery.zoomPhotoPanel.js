(function($){
	/*
	 * zoomPhotoPanel
	 *
	 * Description:
	 * 　拡大写真パネルを生成する
	 *
	 * Sample:
	 * $.zoomPhotoPanel($('.gallery'), {}, function() {});
	 */

	$.zoomPhotoPanel = function(obj, options, callback) {

		var params = $.extend({}, $.zoomPhotoPanel.defaults, options);

		/* ギャラリーHTML（上部） */
		var upper = '<div id="mynavigallery" class="window photo_enlarge display-none">'
				+	'<div class="inner">'
				+	'<div id="mynavislider" class="carousel">'
				+	'<p id="mynavigallery-back" class="button back"><a href="#">'
				+	'<% if (max > 1) { %>'
				+	'<img src="' + params.imagePath + '/btn_carousel_back_l.png" alt="前へ" width="50" height="50" class="imgover" />'
				+	'<% } %>'
				+	'</a></p><div class="screen">'
				+	'<p id="gallery-counter" class="counter"><em><%= max %></em>枚中 <em id="current-counter">0</em>枚目を表示</p>'
				+	'<ul id="gallery-slider" class="photos position-relative">';

		/* ギャラリーHTML（画像） */
		var list = '<% _.each(photos, function(data) { %> '
				+	'<li>'
				+	'<div class="photo photo_ll">'
				+	'<img src="<%= data.imagePath %>" alt="<%= data.caption %>" height="522" class="image" />'
				+	'</div></li>'
				+	'<% }); %>';

		/* ギャラリーHTML（下部） */
		var bottom = '</ul>'
				+	'</div>'
				+	'<p id="mynavigallery-next" class="button next"><a href="#">'
				+	'<% if (max > 1) { %>'
				+	'<img src="' + params.imagePath + '/btn_carousel_next_l.png" alt="次へ" width="50" height="50" class="imgover" />'
				+	'<% } %>'
				+	'</a></p></div>'
				+	'</div>'
				+	'<p id="layerclose" class="button"><a href="#">'
				+	'<img src="' + params.imagePath + '/btn_full-screen_close.png" alt="閉じる" width="26" height="26" class="imgover" /></a></p>'
				+	'</div>';

		/**
		 * 画像ギャラリーを生成する
		 */
		var init = function() {

			var photos = [];

			/* ギャラリーに設定する画像データ配列を生成する */
			obj.each(function(i) {

				var $this = $(this)
				,	photo = $this.find('img.gallery-photo')
				,	data = {};

				/* ギャラリー画像に設定する値をdataに設定 */
				if (photo.attr('osrc') == null) {
					data.imagePath = photo.attr('src');
				} else {
					data.imagePath = photo.attr('osrc');
				}
				data.imagePath = data.imagePath;
				data.caption = photo.attr('alt');
				data.imageId = $this.data('imageid');

				// テンプレートに渡すため配列に格納
				photos[photos.length] = data;

				// 虫眼鏡のアイコンをフェードで表示する。
				(function() {
					var nowLoding = false;
					$this.find('.zoom-in')
						.css('position','absolute')
						.css('top',0)
						.css('right',0)
						.hide()
					.end()
					.hover(function() {
						$(this).find('.zoom-in').stop().fadeIn('slow', function() {
							$(this).css('opacity', 1);
						});
					},function() {
						$(this).find('.zoom-in').hide();
					});
				})();

			});

			// 生成したHTMLをbodyタグにappendする
			$('body').append($(_.template(upper, {max: obj.length}) + _.template(list, {photos: photos}) + _.template(bottom, {max: obj.length})));
		};

		/**
		 * イベントバンドル
		 */
		var bundle = function() {

			// 画像ギャラリーにスライダーを設定する
			var slider = $('#mynavislider').mynavislider({
					'shift': 1
				,	'backBtnKey': '#mynavigallery-back'
				,	'nextBtnKey': '#mynavigallery-next'
				,	'carousel': params.carousel
				,	'slideCallBack': function(data) {
					$('#current-counter').html(data.pageNo);
				}
			});

			/* 対象画像クリック時にギャラリーオープンイベントをバインドする */
			obj.each(function(i) {
				var photo = $(this).find('img.gallery-photo, img.zoom-in')
				,	pos = i+1;
				photo.click(function(e) {
					e.preventDefault();
					slider.changePage(pos);
					$.mLightBox({'mLightBoxId': '#mynavigallery', duration: 300});
				});
			});

			$('#layerclose').click(function(e) {
				e.preventDefault();
				$.mLightBox.close();
			});
		};

		(function() {

			// 画像ギャラリーを生成する
			init();

			// イベントバンドル
			bundle();

			// コールバック
			if (_.isFunction(callback)) callback();

		})();

	};

	$.zoomPhotoPanel.defaults = {
		'showClip':		true
	,	'showInfo':		false
	,	'carousel':		true
	,	'imagePath':	'/img'
	,	'shiftw': 		696
	};

})(jQuery);

