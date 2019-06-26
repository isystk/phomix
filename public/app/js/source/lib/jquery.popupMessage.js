(function($) {
/*
 * popupMessage
 *
 * Description:
 * 　ポップアップメッセージを表示する
 *
 * Sample:
 * 	$.popupMessage({
 *		message: "こんにちは"
 *  });

 */

var options = {
	message: "",
	alertId: "popupAlert",
	closeId: "popupClose",
	messageId: "popupMessage",
	callback: function(){}
},
	isFirst = true,

	timeout = null

	;

$.popupMessage = function(opts) {
	$.extend(options, opts);

	clearTimeout(options.timeout);

	var elem = $('#'+options.alertId);
	if (!elem || elem.length <= 0) {
		elem = $(['<div id="'+options.alertId+'" class="window display-none" style="width:350px">',
			'<div class="inner">',
				'<p id="popupMessage"><br></p>',
			'</div>',
			//'<p class="button"><a href="#" id="'+options.closeId+'"><img src="../img/btn_window_close.png" alt="閉じる" width="15" height="15" class="imgover"></a></p>',
		'</div>'].join(''));
		elem.appendTo('body');
	}

	var top  = Math.floor($(window).scrollTop() + ($(window).height() - elem.height() - 20)),
		left = Math.floor($(window).scrollLeft() + ($(window).width() - elem.width() - 20));

	elem.stop().hide().css({
		position: "absolute",
		top: Math.floor($(window).scrollTop() + ($(window).height() + elem.height())) + "px",
		left: left + "px",
		"z-index": 5000
	});

	$('#'+options.messageId).html(options.message);

	if (isFirst) {
		$('#'+options.closeId).click(function(event){
			event.preventDefault();

			clearTimeout(options.timeout);

			elem.animate({
				top: Math.floor($(window).scrollTop() + ($(window).height() + elem.height())) + "px"
			}, 300, "easeOutBack", function(){
				$(this).hide();
			});
		});
		isFirst = false;
	}

	elem.show().animate({
		top: top + "px",
		left: left + "px"
	}, 300, "easeOutBack", function(){
		options.callback();

		options.timeout = setTimeout(function() {
			elem.animate({
				top: Math.floor($(window).scrollTop() + ($(window).height() + elem.height())) + "px"
			}, 300, "easeOutBack", function(){
				$(this).hide();
			});
		}, 2000);
	});
};

})(jQuery);

