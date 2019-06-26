(function($) {
	/*
	 * mynavimessage
	 *
	 * Description:
	 * 　ポップアップメッセージを表示する
	 *
	 * Sample:
	 * 	$.mynavimessage({
	 *		message: "こんにちは"
	 *  });

	 */

	var options = {
		message: "",
		windowClassName: "popupWindow",
		timer: 5000,
		zIndex: 10000,
		callback: function(){}
	};

	$.mynavimessage = function(opts) {
		var settings = $.extend(options, opts);

		var totalHeight = 5;
		$('.' + settings.windowClassName).each(function() {
			totalHeight = totalHeight + $(this).height() + 5;
		});

		var elem = $([
			'<div class="'+settings.windowClassName+'">',
				'<div class="inner">',
				'<p class="message"></p>',
				'</div>',
			'</div>'
					].join(''))
			.css('position', 'fixed')
			.css('z-index', settings.zIndex)
			.css('background-color', '#ffffff')
			.css('border', 'solid 2px black')
			.css('width', '360px')
			.css('border-radius', '10px')
			.css('filter', 'alpha(opacity=90)')
			.css('-moz-opacity', '0.9')
			.css('opacity', '0.9');

		$('<p class="button"><a href="#" class="closeBtn">[閉じる]</a></p>')
			.css('position', 'absolute')
			.css('top', '6px')
			.css('right', '6px')
			.css('margin', '0').appendTo(elem);

		$('body').append(elem);
		var top  = Math.floor(totalHeight),
			left = Math.floor($(window).width() - elem.width() - 20);

		elem.hide().css({
			top: top + "px",
			left: left + "px"
		});

		elem.find('.message').html(settings.message);

		elem.fadeIn(300, function(){
			options.callback();

			var timer = setTimeout(function() {
				clearInterval(timer);
				elem.fadeOut(300, "easeOutBack", function(){

					var self = $(this);

					self.remove();
					removeWin();
				});
			}, settings.timer);

			// マウスオーバー時に、自動クローズを停止
			elem.click(function (e) {
				e.preventDefault();
				clearInterval(timer);
			});

			// 閉じるリンククリック時
			elem.find('.closeBtn').click(function(e) {
				e.preventDefault();
				var self = $(this).closest('.'+settings.windowClassName);
				self.remove();
				removeWin();
			});
		});

		var nowLoading = false;
		var removeWin = function() {
			if (nowLoading) {
				return;
			}
			nowLoading = true;
			var listSize = $('.' + settings.windowClassName).size();
			var totalHeight = 5;
			$('.' + settings.windowClassName).each(function(i) {
				var self = $(this);
				if (i !== 0) {
					totalHeight = totalHeight + self.height() + 5;
				}
				self.animate({
					top: totalHeight + "px"
				}, 300, "easeOutBack", function(){
					if (listSize-1 === i)  {
						nowLoading = false;
					}
				});

			});
		};

	};

})(jQuery);

