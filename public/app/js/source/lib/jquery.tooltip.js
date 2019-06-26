
(function($) {
	/*
	 * tooltip
	 *
	 * Copyright (c) 2013 iseyohsitaka at teamLab
	 *
	 * Description: ツールチップを表示する
	 */
	$.fn.tooltip = function(options) {

		// デフォルト値
		var defaults = {
			screen : ['<div class="window forefront display-none">',
					 	'<div class="inner">',
					 		'<p class="text"></p>',
						'</div>',
						'<p class="button js-closebtn"><a href="#" class="closeBtn"><img src="/img/btn_window_close.png" alt="閉じる" width="15" height="15" class="imgover" /></a></p>',
					'</div>'
				 ].join(''),
			text : null,
			closeBtn : '.js-closebtn',
			isClick : false,
			left : null
		};

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(defaults, options);

		var screen = null,
			closeBtn = null;

		var init = function(obj) {
			screen = $(settings.screen);
			closeBtn = $(settings.closeBtn);

			// 表示するテキストを設定する。
			if (settings.text) {
				screen.find('.text').append(settings.text);
			}

			// クリックの場合
			if (!settings.isClick) {
				closeBtn.hide();
			}

			// 位置の調整
			if (settings.left) {
				screen.css('left', settings.left);
			}

			$(obj).after(screen);
		};

		var bind = function(obj) {
			var target = $(obj).next('div.window,div.window2,div.popup_bg');
			// クリックの場合
			if (settings.isClick) {
				$(obj).click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					if (!target.is(':visible')) {
						$(settings.closeBtn).click();
						target.show();
					}
				});
				closeBtn.click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					target.hide();
				});
				$(target).click(function(e) {
					e.stopPropagation();
				});
				$('body').click(function(e) {
					if (target.is(':visible')) {
						e.preventDefault();
						target.hide();
					}
				});
			// マウスオーバーの場合
			} else {
				$(obj).click(function(e) {
					event.preventDefault();
				});
				$(obj).hover(
					function () {
						target.show();
					},
					function () {
						target.hide();
					}
				);

			}
		};

		// 処理開始
		$(this).each(function() {
			init(this);
			// イベントのバインド
			bind(this);
		});

	};

})(jQuery);

