/*
 * mynaviMove
 *
 * Copyright (c) 2013 matsudashogo at teamLab
 *
 * Description:
 *  ページ内遷移のライブラリを提供します。固定ヘッダーなどを考慮した遷移が可能です。
 *
 * Options:
 * target - ajax読み込みなどの対象を指定します
 * from - クリック対象を指定します
 * to - 遷移先を指定します
 * margin_top - 遷移先に対してずらす高さを指定します（デフォルト：式場詳細ナビに合わせてあります）
 * speed - アニメーションの早さを指定します
 *
 * Sample:
 * $.mynaviMove({
 *			target : $('#ajaxResult'),
 *			from : '#movePlan',
 *			to : '#ajaxResultPlan'
 *		});
 *
 */
(function($){

	// デフォルト値
	var options = {
		'separator' : document,
		'target' : null,
		'to' : null,
		'margin_top' : null,
		'speed' : 600
	};

	$.mynaviMove = function(opts)
	{
		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(options, opts);

		var scrollTo = ($(settings.to).offset().top - settings.margin_top);

		$(settings.separator).find(settings.target).click(function(e) {
			e.preventDefault();
			$('html, body').animate({scrollTop: scrollTo}, settings.speed);
		});

	};

})(jQuery);


