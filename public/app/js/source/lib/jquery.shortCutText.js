
(function($){
	/*
	 * shortCutText
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * メッセージ表示が長い場合に「・・・・・>>続きを読む」を表示して、メッセージを短縮する。
	 */
	// デフォルト値
	var options = {
		wrapselector : document,
		targetselector : ".js_shortCutText",
		lineWidth : 295, // 1行の幅
		minWordCount : 0, // １行に表示する最小文字数（この数値を大きくするとパフォーマンスが上がりますが、上げ過ぎると上手く動きません＞＜）
		showLineCount : 4, // 表示させる行数
		textLabel : '・・・・・>>続きを読む',
		isLinkBreak : false, // リンク部分を改行させるかどうか
		callbackfunc : undefined // 続きを読むをクリックした際のコールバック処理
	};

	$.shortCutText = function(opts, callback) {

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(options, opts);

		$.customEach($(settings.wrapselector).find(settings.targetselector), {loop: function (idx, obj) {
			var target = $(obj),
				text = target.text(),
				str = text.split('');

			// テキストを空にする
			target.empty();

			// 続きを見るのリンク
			var link = $('<span style="float: right"><a href="#">'+settings.textLabel+'</a></span>');
			target.append(link);
			var linkWidth = target.width();

			// テキストを空にする
			target.empty();

			var appendSpan = function() {
				var span = $('<span class="js-line"></span>').css('float', 'left');
				span.appendTo(target);
				return span;
			};

			var span = appendSpan();

			var lineNo = 1;
			for (var i=0, len=str.length; i<len; i++) {
				var s = str[i];
				/* ここから パフォーマンスチューニング用の設定
				   必ず１行に納まる想定の文字数を１度に追加してしまう。
				 */
				if (span.text().length < settings.minWordCount) {
					if (i+settings.minWordCount < str.length) {
						span.text(span.text()+text.substr(i, settings.minWordCount));
						i = i+settings.minWordCount-1;
					} else {
						span.text(span.text()+text.substr(i, str.length-i));
						i = i + (str.length-1-i);
					}
				} else {
					span.text(span.text()+s);
				}
				/* ここまで パフォーマンスチューニング用の設定  */
				// 最終行の場合
				if (lineNo === settings.showLineCount) {
					var spanWidth = span.width();
					if (!settings.isLinkBreak) {
						spanWidth = spanWidth + linkWidth;
					}
					if (settings.lineWidth <= spanWidth) {
						if (settings.isLinkBreak) {
							$('<br/>').appendTo(target);
						}
						link.appendTo(target);
						lineNo++;
						link.click(function(e) {
							e.preventDefault();
							if (settings.callbackfunc) {
								settings.callbackfunc(target);
								return;
							} else {
								if(settings.callbackfunc) {
									return;
								}
								target.empty().text(text);
								$(this).remove();
								return;
							}
						});
						break;
					}
				} else {
					if (settings.lineWidth <= span.width()) {
						$('<br/>').appendTo(target);
						span = appendSpan();
						lineNo++;
					}
				}
			}
			$('<br/>').appendTo(target);

		}, callback: callback
		});

	};

})(jQuery);

