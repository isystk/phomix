
(function($) {
/*
 * imageLazyLoader
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * �摜�x�����[�_�[
 * $("#hoge img, #foo img").imageLazyLoader({ threshold: 200 });
 */

var opts = {
		threshold: 0,			// ��ǂ�px
		container: window		// �X�N���[���R���e�i
	},

	selector = null,

	_IMAGE_CACHE = null,

	EVENT_NAME = "scroll.imageLazyLoader"

	;

$.fn.imageLazyLoader = function(options){
	_IMAGE_CACHE = $.makeArray(this);
	selector = $(this).selector;
	$.imageLazyLoader(options);
};

$.imageLazyLoader = function(options){
	$.extend(opts, options);

	bindScroll();

	// fire
	$(opts.container).trigger(EVENT_NAME);

	return $.imageLazyLoader;
};

$.imageLazyLoader.refresh = function() {
	_IMAGE_CACHE = $.makeArray($(selector));

	// fire
	$(opts.container).trigger(EVENT_NAME);
};

$.imageLazyLoader.unbind = function() {
	$(opts.container).unbind(EVENT_NAME);
};

function bindScroll() {
	// scroll event
	$(opts.container).bind(EVENT_NAME, function(event) {
		var elements = _IMAGE_CACHE,
			container = $(opts.container),
			height = container.height(),
			scrollTop = container.scrollTop();

		// �����Ă�for��
		for (var i = 0, len = elements.length; i < len; ++i)(function(i) {
			var elem = elements[i];

			// ��ʕ\�����W�łȂ��ꍇ
			if (!belowthefold(elem, opts, height, scrollTop) || abovethetop(elem, opts, height, scrollTop)) { return; }

			// ���[�h�����I
			var self = elem;
			$("<img />")
				.bind("load", function() {
					$(self)
						.attr("src", $(self).attr("osrc"))
						.data("loaded", true);
				})
				.attr("src", $(self).attr("osrc"));
		})(i);

		// ���łɉ摜�����[�h�����v�f�͏�������
		removeAlreadyElement();
	});
}

function removeAlreadyElement() {
	var elements = _IMAGE_CACHE,
		_elements = [],
		elem = null;

	for (var i = 0, len = elements.length; i < len; ++i) {
		elem = elements[i];

		// �摜���܂����[�h����Ă��Ȃ�
		if (!$(elem).data("loaded")) { _elements.push(elem); };
	}

	_IMAGE_CACHE = _elements;
}

//�o���ʒu�ɂ���
function belowthefold(element, settings, height, scrollTop) {
	var fold = height + scrollTop;
	return fold > $(element).offset().top - settings.threshold;
}

// ��ʂ��������
function abovethetop(element, settings, height, scrollTop) {
	var fold = scrollTop;
	return fold >= $(element).offset().top + settings.threshold  + $(element).height();
}
})(jQuery);
