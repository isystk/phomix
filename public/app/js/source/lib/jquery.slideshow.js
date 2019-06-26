(function($) {
	/*
	 * mynavislideshow
	 *
	 * Copyright (c) 2012 wakui at teamLab
	 *
	 * Description:
	 * 　マイナビウェディングスライドショー
	 *
	 * Sample:
	 * $('#slideshow').mynavislideshow({});
	 */
	$.fn.mynavislideshow = function() {

		var SLIDE_TYPE_FADE = 0
		,	SLIDE_TYPE_H = 1
		,	SLIDE_TYPE_V = 2
		,	SLIDE_TOP_MARGIN = 70	// 画像初期配置のトップマージン
		;

		var screen = null		// ギャラリー画像表示枠
		,	ul = null			// ギャラリー用ULタグ
		,	li = null			// ギャラリー用LIタグ
		,	description = null	// 画像コメント
		,	pos = 0				// ギャラリーポジション
		,	shiftw = 0			// ギャラリー移動量（横）
		,	shifth = 0			// ギャラリー移動量（縦）
		,	interval = 0		// アニメーションインターバル
		,	cachedList = null;

		var cur = null			// 現在表示中画像
		,	next = null;		// 次回表示予定画像

		var params = {
			'showMessage':	'true'
		,	'fadeSpeed':	900
		,	'slideSpeed':	900
		,	'slideTime':	3000
		,	'slideType':	0
		,	'easing':		'easeOutSine'
		,	'carousel':		'true'
		,	'random':		'false'
		};

		var isLastPhoto = function() {
			// 番兵が存在している場合はli.sizeからマイナス１を終端とする
			return (pos >= li.size()-((params.slideType===SLIDE_TYPE_FADE)?0:1));
		};

		var init = function() {

			screen = $('#full-screen');
			shiftw = screen.width();
			shifth = screen.height() * 0.75;

			ul = screen.find('ul');
			li = ul.find('li').css({
					'height': shifth
				,	'opacity': 1
				}).removeClass('cur');
			description = $('#slide-description');

			// コメントに１枚めの画像コメントを差し込む
			description.html(li.filter(':first').find('img').attr('alt'));

			// メーッセージ表示がOFFの場合
			if (params.showMessage === 'false') {
				description.css('visibility', 'hidden');
			} else {
				description.css('visibility', 'visible');
			}

			// リサイズ等で初期化を行う場合はキャッシュしたリストを使ってスライドショーを初期化する
			if (cachedList === null || cachedList.size() === 0) {
				cachedList = li;
			} else {
				ul.empty().append(cachedList);
			}

			// 表示画像のポジションをリセット
			pos = 0;
			// 動作中のアニメーションを止めてトップマージンを設定
			ul.css('top', SLIDE_TOP_MARGIN);
			// cloneが存在してれば削除
			li.filter('.slide-cloned').remove()
			.end()
			   .filter(':first').addClass('cur');

			// スライドタイプ別初期化処理
			switch(params.slideType) {
				case SLIDE_TYPE_FADE:
					initFade();
					break;
				case SLIDE_TYPE_H:
					initH();
					break;
				case SLIDE_TYPE_V:
					initV();
					break;
			}
		};

		/**
		 * フェードスライドエフェクト初期化処理
		 */
		var initFade = function() {

			li.each(function(i) {

				var $this = $(this);
				if (i === 0) {
					$this.css({
						'width': screen.width()
					});
				} else {
					$this.css({
						'width': screen.width()
					,	'opacity': 0
					});
				}
			});

			interval = setInterval(function() {
				fade();
			}, params.slideTime);
		};

		/**
		 * 横スライドエフェクト初期化処理
		 */
		var initH = function() {

			// カルーセル設定がされている場合
			if (params.carousel === 'true') {
				ul.css('left', '0px')
					.append(li.filter(':first').clone().addClass('slide-cloned'));

				// liを再キャッシュ
				li = ul.find('li');
			} else {
				ul.css({'left': '0px', 'top': SLIDE_TOP_MARGIN});
			}

			// ulタグの横幅を調整する
			ul.css('width', li.size() * screen.width());

			// liタグの横幅・位置を調整する
			li.each(function(i) {
				$(this).css({
					'width': screen.width()
				,	'left': (i * screen.width()) + 'px'
				});
			});

			interval = setInterval(function() {
				nextAnimate(slide);
			}, params.slideTime);
		};

		/**
		 * 縦スライドエフェクト初期化処理
		 */
		var initV = function() {

			// カルーセル設定がされている場合
			if (params.carousel === 'true') {
				ul.css({
						'top': SLIDE_TOP_MARGIN + 'px'
					,	'left': '0px'
					,	'width': screen.width()
					})
					.append(li.filter(':first').clone().addClass('slide-cloned'));

				// liを再キャッシュ
				li = ul.find('li');
			} else {
				ul.css({'left': '0px', 'width': screen.width()});
			}

			// ulタグの縦幅を調整する
			ul.css('height', li.size() * screen.height());

			li.each(function(i) {
				$(this).css({
					'height': shifth
				,	'top': (i*screen.height()) + 'px'
				});
			});

			interval = setInterval(function() {
				nextAnimate(slideup);
			}, params.slideTime);
		};

		/**
		 * 画像ギャラリーをスライドする(フェード)
		 */
		var nextAnimate = function(func) {

			var showNext = true;

			// カルーセル
			if (params.carousel === 'true') {
				doCarousel();
			} else {
				if (isLastPhoto()) {
					showNext = false;
					clearInterval(interval);
				}
			}

			if (showNext) {
				func();
				description.html(next.find('img').attr('alt'));
			}
		}

		/**
		 * 画像ギャラリーをスライドする(フェード)
		 */
		var fade = function() {

			cur = li.filter('.cur');
			next = cur.next();

			if (params.carousel === 'true' && next.size() === 0) {
				next = li.filter(':first');
				pos = 0;
			} else if (next.size() === 0) {
				clearInterval(interval);
				return;
			}

			++pos;

			cur.animate({'opacity': 0}
			,	params.fadeSpeed
			,	params.easing
			,	function() {

				nextAnimate(function() {
					next.animate({'opacity': 1}
						,	params.fadeSpeed
						,	params.easing
						,	function() {
							setCurrentPosition();
						});
				});

			});
		};

		/**
		 * 画像ギャラリーをスライドする(横)
		 */
		var slide = function() {

			if (ul.is(':animated')) return;

			cur = li.filter('.cur');
			next = cur.next();

			++pos;

			ul.animate(
				{ left: - (pos * shiftw) }
			,	params.slideSpeed
			,	params.easing
			,	function() {
				setCurrentPosition();
			});
		};

		/**
		 * 画像ギャラリーをスライドする(縦)
		 */
		var slideup = function() {

			if (ul.is(':animated')) return;

			cur = li.filter('.cur');
			next = cur.next();

			++pos;

			ul.animate(
				{ top: - ((pos * screen.height()) - SLIDE_TOP_MARGIN) }
			,	params.slideSpeed
			,	params.easing
			,	function() {
				setCurrentPosition();
			});
		};

		/**
		 * 現在地設定
		 */
		var setCurrentPosition = function() {
			cur.removeClass('cur');
			next.addClass('cur');
		}

		/**
		 * カルーセル終端処理
		 */
		var doCarousel = function() {

			if(!isLastPhoto()) return;

			switch(params.slideType) {
				case SLIDE_TYPE_FADE:
					break;
				case SLIDE_TYPE_H:
					ul.css('left', '0px')
					pos = 0;
					li.removeClass('cur').filter(':first').addClass('cur');
					break;
				case SLIDE_TYPE_V:
					ul.css('top', '0px')
					pos = 0;
					li.removeClass('cur').filter(':first').addClass('cur');
					break;
			}
		};

		/**
		 * イベントバンドル
		 */
		var bundle = function() {

			/* windowがリサイズされた場合 */
			$(window).resize(function () {

				if ($('#full-screen').is(':hidden')) return;

				clearInterval(interval);

				init();
			});

			/* スライドショーを表示ボタンクリック時 */
			$('.slideshow').click(function() {

				clearInterval(interval);

				cachedList = null;

				// 画面から受け取ったパラメータを設定する
				params.showMessage = $('.showMessage:checked').val();
				params.slideType = parseInt($('.animateType:checked').val(), 10);
				params.slideTime = params.slideSpeed + (1000 * parseInt($('.switchTime:checked').val(), 10));
				params.carousel = $('.doLoop:checked').val();
				params.random = $('.showType:checked').val();

				var albumPhotos = $('#album-photos').find('li.checked')
				,	slideFrame = $('#slide-photos')
				,	slidePhotos = []
				,	photoTemplate = '<% _.each(photos, function(data) { %>'
								+	'<li><img src="<%- data.imagePath %>" alt="<%- data.caption %>" width="776" height="582" class="image" /></li>'
								+	'<% }); %>';

				// 画像が選択されていない場合はエラー処理
				if (albumPhotos.size() === 0) {
					$.mynavialert({message: "スライドショーに表示する画像を選択してください。"});
					return;
				}

				// テンプレートを元にHTMLを生成しチェックされている画像でスライドショーを作成する
				albumPhotos.each(function() {
					var photo = $(this).find('img')
					,	data = {};

					// ギャラリー画像に設定する値をdataに設定
					data.imagePath = photo.attr('src');
					data.caption = photo.attr('alt');

					// テンプレートに渡すため配列に格納
					slidePhotos[slidePhotos.length] = data;
				});

				if (params.random === 'true') {
					slidePhotos = _.shuffle(slidePhotos);
				}

				slideFrame.empty().append($(_.template(photoTemplate, {photos: slidePhotos})));

				// 正常な高さを取得するため初期化前にスクリーンを表示する
				$('#full-screen').show();

				init();
			});

			/* スライドショー画面クリック時 */
			$('#full-screen').click(function(e) {

				e.preventDefault();

				clearInterval(interval);

				$('#full-screen').hide();
			});

			/* ESCキー押下時 */
			$(document).keyup(function(e) {

				if ($('#full-screen').is(':visible') && e.keyCode == 27) {

					clearInterval(interval);

					$('#full-screen').hide();
				}
			});
		};

		/**
		 * メイン処理
		 */
		return this.each(function() {

			// 共通初期化処理
			init();

			// イベントバンドル
			bundle();
		});

	};

})(jQuery);
