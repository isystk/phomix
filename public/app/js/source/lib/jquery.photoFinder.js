(function($) {
	/*
	 * photoFinder
	 * Copyright (c) 2013 iseyoshitaka
	 *
	 * Description:
	 *  画像検索
	 *
	 * Sample:
	 */
	$.photoFinder = function(word, callback) {

		var uri = 'https://www.googleapis.com/customsearch/v1';
		var param = [];
		param.push('num=10');
		param.push('start=1');
		param.push('q='+word);
		param.push('cx=012220449560669031557%3A5_0q2vq3gm4');
		param.push('searchType=image');
		param.push('key=AIzaSyCZC97xNh4pjmu5MHWkKPz31uR5QTdv4Fk');
		var url = $.uriParamJoin(uri, param);

		$.get(url, {}, function(result) {
			if (callback) {
				callback(result);
			}
		});
	};

})(jQuery);


