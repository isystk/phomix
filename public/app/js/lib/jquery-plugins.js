/**
 * jQuery.bottom
 * Dual licensed under MIT and GPL.
 * Date: 2010-04-25
 *
 * @description Trigger the bottom event when the user has scrolled to the bottom of an element
 * @author Jim Yi
 * @version 1.0
 *
 * @id jQuery.fn.bottom
 * @param {Object} settings Hash of settings.
 * @return {jQuery} Returns the same jQuery object for chaining.
 *
 */
(function($){
	$.fn.bottom = function(options) {

		var defaults = {
			// how close to the scrollbar is to the bottom before triggering the event
			proximity: 0
		};

		var options = $.extend(defaults, options);

		return this.each(function() {
			var obj = this;
			$(obj).bind("scroll", function() {
				if (obj == window) {
					scrollHeight = $(document).height();
				}
				else {
					scrollHeight = $(obj)[0].scrollHeight;
				}
				scrollPosition = $(obj).height() + $(obj).scrollTop();
				if ( (scrollHeight - scrollPosition) / scrollHeight <= options.proximity) {
					$(obj).trigger("bottom");
				}
			});

			return false;
		});
	};
})(jQuery);
/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);
(function($) {
  $.fn.charCount = function(conf){
    var defaults = {
      allowed: 140,
      counterTarget: '#counter',
      cssWarning: 'warning'
    };

    var conf = $.extend(defaults, conf);

    function calculate(obj){
      var count = $(obj).val().length;
      var available = conf.allowed - count;
      if(available < 0){
        $(conf.counterTarget).addClass(conf.cssWarning);
      } else {
        $(conf.counterTarget).removeClass(conf.cssWarning);
      }
      $(conf.counterTarget).html(available);
    };

    this.each(function() {
      calculate(this);
      $(this).keyup(function(){calculate(this)});
      $(this).change(function(){calculate(this)});
    });

  };
})(jQuery);
(function($) {
/*
 * customEach
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Options:
 * eachCount - setTimeoutを挟みたいカウント数
 * init - 最初に実行したい関数
 * loop - ループ処理時に実行したい関数
 * callback - 最後に実行したい関数
 *
 * Description:
 * 適度にループしたい場合に使えるです。
 *   重いループのとき、IEとかでスクリプト停止のダイアログが出てしまう場合があるが、
 *   これを防ぐために、eachCountずつsetTimeoutを挟むためダイアログが出ないようにできる
 *   ※注意！ customEachを連続して実行したい場合は、必ずcallbackに入れること。
 */

$.customEach = function(object, options) {
	new customEach(object, options);
};

function customEach(object, options) {
	var opts = {
		eachCount: 1,
		eachLength: null,
		init: function() {},
		loop: function() {},
		callback: function() {}
	};

	var makeObject = make(object, options);
		options = makeObject.options;
		object = makeObject.object;

	$.extend(opts, options);

	var i = 0,
		max = object ? object.length : opts.eachLength,
		len;

	object = object ? object : new Array;

	opts.init();
	(function() {
		len = customLen(max, opts.eachCount, i);

		for (;i < len; ++i) {
			opts.loop.call(object[i], i, object[i]);
		}

		if (max <= len){
			opts.callback();
			return;
		}

		setTimeout(arguments.callee, 0);
	})();
}

function make(object, options) {
	var ret = {
		options: null,
		object: null
	};

	if ($.isArray(object) || object && object.length) {
		ret.object = object;
		ret.options = options;
	} else {
		ret.object = null;
		ret.options = object;
	}

	return ret;
}

function customLen(max, count, i) {
	return (function() {
		var next = i + count,
			ret;

		if (max >= next) {
			ret = next;
		} else {
			ret = max;
		}

		return ret;
	})();
}

})(jQuery);


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
(function($){
	/**
	 * Jquery プラグイン 画像ロード監視
	 */
	$.fn.imagesLoaded = function(callback){
		var elems = this.filter('img'),
			len   = elems.length,
			blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

		elems.bind('load.imgloaded',function(){
			if (--len <= 0 && this.src !== blank){
				elems.unbind('load.imgloaded');
				callback.call(elems,this);
			}
		}).each(function(){
			// cached images don't fire load sometimes, so we reset src.
			if (this.complete || this.complete === undefined){
				var src = this.src;
				// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
				// data uri bypasses webkit log warning (thx doug jones)
				this.src = blank;
				this.src = src;
			}
		});

		return this;
	};
})(jQuery);

/*
 * imgAreaSelect jQuery plugin
 * version 0.9.3
 *
 * Copyright (c) 2008-2010 Michal Wojciechowski (odyniec.net)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://odyniec.net/projects/imgareaselect/
 *
 */

(function($) {

var abs = Math.abs,
    max = Math.max,
    min = Math.min,
    round = Math.round;

function div() {
    return $('<div/>');
}

$.imgAreaSelect = function (img, options) {
    var

        $img = $(img),

        imgLoaded,

        $box = div(),
        $area = div(),
        $border = div().add(div()).add(div()).add(div()),
        $outer = div().add(div()).add(div()).add(div()),
        $handles = $([]),

        $areaOpera,

        left, top,

        imgOfs,

        imgWidth, imgHeight,

        $parent,

        parOfs,

        zIndex = 0,

        position = 'absolute',

        startX, startY,

        scaleX, scaleY,

        resizeMargin = 10,

        resize,

        minWidth, minHeight, maxWidth, maxHeight,

        aspectRatio,

        shown,

        x1, y1, x2, y2,

        selection = { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 },

        docElem = document.documentElement,

        $p, d, i, o, w, h, adjusted;

    function viewX(x) {
        return x + imgOfs.left - parOfs.left;
    }

    function viewY(y) {
        return y + imgOfs.top - parOfs.top;
    }

    function selX(x) {
        return x - imgOfs.left + parOfs.left;
    }

    function selY(y) {
        return y - imgOfs.top + parOfs.top;
    }

    function evX(event) {
        return event.pageX - parOfs.left;
    }

    function evY(event) {
        return event.pageY - parOfs.top;
    }

    function getSelection(noScale) {
        var sx = noScale || scaleX, sy = noScale || scaleY;

        return { x1: round(selection.x1 * sx),
            y1: round(selection.y1 * sy),
            x2: round(selection.x2 * sx),
            y2: round(selection.y2 * sy),
            width: round(selection.x2 * sx) - round(selection.x1 * sx),
            height: round(selection.y2 * sy) - round(selection.y1 * sy) };
    }

    function setSelection(x1, y1, x2, y2, noScale) {
        var sx = noScale || scaleX, sy = noScale || scaleY;

        selection = {
            x1: round(x1 / sx),
            y1: round(y1 / sy),
            x2: round(x2 / sx),
            y2: round(y2 / sy)
        };

        selection.width = selection.x2 - selection.x1;
        selection.height = selection.y2 - selection.y1;
    }

    function adjust() {
        if (!$img.width())
            return;

        imgOfs = { left: round($img.offset().left), top: round($img.offset().top) };

        imgWidth = $img.width();
        imgHeight = $img.height();

        minWidth = options.minWidth || 0;
        minHeight = options.minHeight || 0;
        maxWidth = min(options.maxWidth || 1<<24, imgWidth);
        maxHeight = min(options.maxHeight || 1<<24, imgHeight);

        if ($().jquery == '1.3.2' && position == 'fixed' &&
            !docElem['getBoundingClientRect'])
        {
            imgOfs.top += max(document.body.scrollTop, docElem.scrollTop);
            imgOfs.left += max(document.body.scrollLeft, docElem.scrollLeft);
        }

        parOfs = $.inArray($parent.css('position'), ['absolute', 'relative']) + 1 ?
            { left: round($parent.offset().left) - $parent.scrollLeft(),
                top: round($parent.offset().top) - $parent.scrollTop() } :
            position == 'fixed' ?
                { left: $(document).scrollLeft(), top: $(document).scrollTop() } :
                { left: 0, top: 0 };

        left = viewX(0);
        top = viewY(0);

        if (selection.x2 > imgWidth || selection.y2 > imgHeight)
            doResize();
    }

    function update(resetKeyPress) {
        if (!shown) return;

        $box.css({ left: viewX(selection.x1), top: viewY(selection.y1) })
            .add($area).width(w = selection.width).height(h = selection.height);

        $area.add($border).add($handles).css({ left: 0, top: 0 });

        $border
            .width(max(w - $border.outerWidth() + $border.innerWidth(), 0))
            .height(max(h - $border.outerHeight() + $border.innerHeight(), 0));

        $($outer[0]).css({ left: left, top: top,
            width: selection.x1, height: imgHeight });
        $($outer[1]).css({ left: left + selection.x1, top: top,
            width: w, height: selection.y1 });
        $($outer[2]).css({ left: left + selection.x2, top: top,
            width: imgWidth - selection.x2, height: imgHeight });
        $($outer[3]).css({ left: left + selection.x1, top: top + selection.y2,
            width: w, height: imgHeight - selection.y2 });

        w -= $handles.outerWidth();
        h -= $handles.outerHeight();

        switch ($handles.length) {
        case 8:
            $($handles[4]).css({ left: w / 2 });
            $($handles[5]).css({ left: w, top: h / 2 });
            $($handles[6]).css({ left: w / 2, top: h });
            $($handles[7]).css({ top: h / 2 });
        case 4:
            $handles.slice(1,3).css({ left: w });
            $handles.slice(2,4).css({ top: h });
        }

        if (resetKeyPress !== false) {
            if ($.imgAreaSelect.keyPress != docKeyPress)
                $(document).unbind($.imgAreaSelect.keyPress,
                    $.imgAreaSelect.onKeyPress);

            if (options.keys)
                $(document)[$.imgAreaSelect.keyPress](
                    $.imgAreaSelect.onKeyPress = docKeyPress);
        }

        if ($.browser.msie && $border.outerWidth() - $border.innerWidth() == 2) {
            $border.css('margin', 0);
            setTimeout(function () { $border.css('margin', 'auto'); }, 0);
        }
    }

    function doUpdate(resetKeyPress) {
        adjust();
        update(resetKeyPress);
        x1 = viewX(selection.x1); y1 = viewY(selection.y1);
        x2 = viewX(selection.x2); y2 = viewY(selection.y2);
    }

    function hide($elem, fn) {
        options.fadeSpeed ? $elem.fadeOut(options.fadeSpeed, fn) : $elem.hide();

    }

    function areaMouseMove(event) {
        var x = selX(evX(event)) - selection.x1,
            y = selY(evY(event)) - selection.y1;

        if (!adjusted) {
            adjust();
            adjusted = true;

            $box.one('mouseout', function () { adjusted = false; });
        }

        resize = '';

        if (options.resizable) {
            if (y <= resizeMargin)
                resize = 'n';
            else if (y >= selection.height - resizeMargin)
                resize = 's';
            if (x <= resizeMargin)
                resize += 'w';
            else if (x >= selection.width - resizeMargin)
                resize += 'e';
        }

        $box.css('cursor', resize ? resize + '-resize' :
            options.movable ? 'move' : '');
        if ($areaOpera)
            $areaOpera.toggle();
    }

    function docMouseUp(event) {
        $('body').css('cursor', '');

        if (options.autoHide || selection.width * selection.height == 0)
            hide($box.add($outer), function () { $(this).hide(); });

        options.onSelectEnd(img, getSelection());

        $(document).unbind('mousemove', selectingMouseMove);
        $box.mousemove(areaMouseMove);
    }

    function areaMouseDown(event) {
        if (event.which != 1) return false;

        adjust();

        if (resize) {
            $('body').css('cursor', resize + '-resize');

            x1 = viewX(selection[/w/.test(resize) ? 'x2' : 'x1']);
            y1 = viewY(selection[/n/.test(resize) ? 'y2' : 'y1']);

            $(document).mousemove(selectingMouseMove)
                .one('mouseup', docMouseUp);
            $box.unbind('mousemove', areaMouseMove);
        }
        else if (options.movable) {
            startX = left + selection.x1 - evX(event);
            startY = top + selection.y1 - evY(event);

            $box.unbind('mousemove', areaMouseMove);

            $(document).mousemove(movingMouseMove)
                .one('mouseup', function () {
                    options.onSelectEnd(img, getSelection());

                    $(document).unbind('mousemove', movingMouseMove);
                    $box.mousemove(areaMouseMove);
                });
        }
        else
            $img.mousedown(event);

        return false;
    }

    function fixAspectRatio(xFirst) {
        if (aspectRatio)
            if (xFirst) {
                x2 = max(left, min(left + imgWidth,
                    x1 + abs(y2 - y1) * aspectRatio * (x2 > x1 || -1)));

                y2 = round(max(top, min(top + imgHeight,
                    y1 + abs(x2 - x1) / aspectRatio * (y2 > y1 || -1))));
                x2 = round(x2);
            }
            else {
                y2 = max(top, min(top + imgHeight,
                    y1 + abs(x2 - x1) / aspectRatio * (y2 > y1 || -1)));
                x2 = round(max(left, min(left + imgWidth,
                    x1 + abs(y2 - y1) * aspectRatio * (x2 > x1 || -1))));
                y2 = round(y2);
            }
    }

    function doResize() {
        x1 = min(x1, left + imgWidth);
        y1 = min(y1, top + imgHeight);

        if (abs(x2 - x1) < minWidth) {
            x2 = x1 - minWidth * (x2 < x1 || -1);

            if (x2 < left)
                x1 = left + minWidth;
            else if (x2 > left + imgWidth)
                x1 = left + imgWidth - minWidth;
        }

        if (abs(y2 - y1) < minHeight) {
            y2 = y1 - minHeight * (y2 < y1 || -1);

            if (y2 < top)
                y1 = top + minHeight;
            else if (y2 > top + imgHeight)
                y1 = top + imgHeight - minHeight;
        }

        x2 = max(left, min(x2, left + imgWidth));
        y2 = max(top, min(y2, top + imgHeight));

        fixAspectRatio(abs(x2 - x1) < abs(y2 - y1) * aspectRatio);

        if (abs(x2 - x1) > maxWidth) {
            x2 = x1 - maxWidth * (x2 < x1 || -1);
            fixAspectRatio();
        }

        if (abs(y2 - y1) > maxHeight) {
            y2 = y1 - maxHeight * (y2 < y1 || -1);
            fixAspectRatio(true);
        }

        selection = { x1: selX(min(x1, x2)), x2: selX(max(x1, x2)),
            y1: selY(min(y1, y2)), y2: selY(max(y1, y2)),
            width: abs(x2 - x1), height: abs(y2 - y1) };

        update();

        options.onSelectChange(img, getSelection());
    }

    function selectingMouseMove(event) {
        x2 = resize == '' || /w|e/.test(resize) || aspectRatio ? evX(event) : viewX(selection.x2);
        y2 = resize == '' || /n|s/.test(resize) || aspectRatio ? evY(event) : viewY(selection.y2);

        doResize();

        return false;

    }

    function doMove(newX1, newY1) {
        x2 = (x1 = newX1) + selection.width;
        y2 = (y1 = newY1) + selection.height;

        $.extend(selection, { x1: selX(x1), y1: selY(y1), x2: selX(x2),
            y2: selY(y2) });

        update();

        options.onSelectChange(img, getSelection());
    }

    function movingMouseMove(event) {
        x1 = max(left, min(startX + evX(event), left + imgWidth - selection.width));
        y1 = max(top, min(startY + evY(event), top + imgHeight - selection.height));

        doMove(x1, y1);

        event.preventDefault();

        return false;
    }

    function startSelection() {
        adjust();

        x2 = x1;
        y2 = y1;

        doResize();

        resize = '';

        if ($outer.is(':not(:visible)'))
            $box.add($outer).hide().fadeIn(options.fadeSpeed||0);

        shown = true;

        $(document).unbind('mouseup', cancelSelection)
            .mousemove(selectingMouseMove).one('mouseup', docMouseUp);
        $box.unbind('mousemove', areaMouseMove);

        options.onSelectStart(img, getSelection());
    }

    function cancelSelection() {
        $(document).unbind('mousemove', startSelection);
        hide($box.add($outer));

        selection = { x1: selX(x1), y1: selY(y1), x2: selX(x1), y2: selY(y1),
                width: 0, height: 0 };

        options.onSelectChange(img, getSelection());
        options.onSelectEnd(img, getSelection());
    }

    function imgMouseDown(event) {
        if (event.which != 1 || $outer.is(':animated')) return false;

        adjust();
        startX = x1 = evX(event);
        startY = y1 = evY(event);

        $(document).one('mousemove', startSelection)
            .one('mouseup', cancelSelection);

        return false;
    }

    function windowResize() {
        doUpdate(false);
    }

    function imgLoad() {
        imgLoaded = true;

        setOptions(options = $.extend({
            classPrefix: 'imgareaselect',
            movable: true,
            resizable: true,
            parent: 'body',
            onInit: function () {},
            onSelectStart: function () {},
            onSelectChange: function () {},
            onSelectEnd: function () {}
        }, options));

        $box.add($outer).css({ visibility: '' });

        if (options.show) {
            shown = true;
            adjust();
            update();
            $box.add($outer).hide().fadeIn(options.fadeSpeed||0);
        }

        setTimeout(function () { options.onInit(img, getSelection()); }, 0);
    }

    var docKeyPress = function(event) {
        var k = options.keys, d, t, key = event.keyCode;

        d = !isNaN(k.alt) && (event.altKey || event.originalEvent.altKey) ? k.alt :
            !isNaN(k.ctrl) && event.ctrlKey ? k.ctrl :
            !isNaN(k.shift) && event.shiftKey ? k.shift :
            !isNaN(k.arrows) ? k.arrows : 10;

        if (k.arrows == 'resize' || (k.shift == 'resize' && event.shiftKey) ||
            (k.ctrl == 'resize' && event.ctrlKey) ||
            (k.alt == 'resize' && (event.altKey || event.originalEvent.altKey)))
        {
            switch (key) {
            case 37:
                d = -d;
            case 39:
                t = max(x1, x2);
                x1 = min(x1, x2);
                x2 = max(t + d, x1);
                fixAspectRatio();
                break;
            case 38:
                d = -d;
            case 40:
                t = max(y1, y2);
                y1 = min(y1, y2);
                y2 = max(t + d, y1);
                fixAspectRatio(true);
                break;
            default:
                return;
            }

            doResize();
        }
        else {
            x1 = min(x1, x2);
            y1 = min(y1, y2);

            switch (key) {
            case 37:
                doMove(max(x1 - d, left), y1);
                break;
            case 38:
                doMove(x1, max(y1 - d, top));
                break;
            case 39:
                doMove(x1 + min(d, imgWidth - selX(x2)), y1);
                break;
            case 40:
                doMove(x1, y1 + min(d, imgHeight - selY(y2)));
                break;
            default:
                return;
            }
        }

        return false;
    };

    function styleOptions($elem, props) {
        for (option in props)
            if (options[option] !== undefined)
                $elem.css(props[option], options[option]);
    }

    function setOptions(newOptions) {
        if (newOptions.parent)
            ($parent = $(newOptions.parent)).append($box.add($outer));

        $.extend(options, newOptions);

        adjust();

        if (newOptions.handles != null) {
            $handles.remove();
            $handles = $([]);

            i = newOptions.handles ? newOptions.handles == 'corners' ? 4 : 8 : 0;

            while (i--)
                $handles = $handles.add(div());

            $handles.addClass(options.classPrefix + '-handle').css({
                position: 'absolute',
                fontSize: 0,
                zIndex: zIndex + 1 || 1
            });

            if (!parseInt($handles.css('width')) >= 0)
                $handles.width(5).height(5);

            if (o = options.borderWidth)
                $handles.css({ borderWidth: o, borderStyle: 'solid' });

            styleOptions($handles, { borderColor1: 'border-color',
                borderColor2: 'background-color',
                borderOpacity: 'opacity' });
        }

        scaleX = options.imageWidth / imgWidth || 1;
        scaleY = options.imageHeight / imgHeight || 1;

        if (newOptions.x1 != null) {
            setSelection(newOptions.x1, newOptions.y1, newOptions.x2,
                newOptions.y2);
            newOptions.show = !newOptions.hide;
        }

        if (newOptions.keys)
            options.keys = $.extend({ shift: 1, ctrl: 'resize' },
                newOptions.keys);

        $outer.addClass(options.classPrefix + '-outer');
        $area.addClass(options.classPrefix + '-selection');
        for (i = 0; i++ < 4;)
            $($border[i-1]).addClass(options.classPrefix + '-border' + i);

        styleOptions($area, { selectionColor: 'background-color',
            selectionOpacity: 'opacity' });
        styleOptions($border, { borderOpacity: 'opacity',
            borderWidth: 'border-width' });
        styleOptions($outer, { outerColor: 'background-color',
            outerOpacity: 'opacity' });
        if (o = options.borderColor1)
            $($border[0]).css({ borderStyle: 'solid', borderColor: o });
        if (o = options.borderColor2)
            $($border[1]).css({ borderStyle: 'dashed', borderColor: o });

        $box.append($area.add($border).add($handles).add($areaOpera));

        if ($.browser.msie) {
            if (o = $outer.css('filter').match(/opacity=([0-9]+)/))
                $outer.css('opacity', o[1]/100);
            if (o = $border.css('filter').match(/opacity=([0-9]+)/))
                $border.css('opacity', o[1]/100);
        }

        if (newOptions.hide)
            hide($box.add($outer));
        else if (newOptions.show && imgLoaded) {
            shown = true;
            $box.add($outer).fadeIn(options.fadeSpeed||0);
            doUpdate();
        }

        aspectRatio = (d = (options.aspectRatio || '').split(/:/))[0] / d[1];

        $img.add($outer).unbind('mousedown', imgMouseDown);

        if (options.disable || options.enable === false) {
            $box.unbind('mousemove', areaMouseMove).unbind('mousedown', areaMouseDown);
            $(window).unbind('resize', windowResize);
        }
        else {
            if (options.enable || options.disable === false) {
                if (options.resizable || options.movable)
                    $box.mousemove(areaMouseMove).mousedown(areaMouseDown);

                $(window).resize(windowResize);
            }

            if (!options.persistent)
                $img.add($outer).mousedown(imgMouseDown);
        }

        options.enable = options.disable = undefined;
    }

    this.remove = function () {
        $img.unbind('mousedown', imgMouseDown);
        $box.add($outer).remove();
    };

    this.getOptions = function () { return options; };

    this.setOptions = setOptions;

    this.getSelection = getSelection;

    this.setSelection = setSelection;

    this.update = doUpdate;

    $p = $img;

    while ($p.length) {
        zIndex = max(zIndex,
            !isNaN($p.css('z-index')) ? $p.css('z-index') : zIndex);
        if ($p.css('position') == 'fixed')
            position = 'fixed';

        $p = $p.parent(':not(body)');
    }

    zIndex = options.zIndex || zIndex;

    if ($.browser.msie)
        $img.attr('unselectable', 'on');

    $.imgAreaSelect.keyPress = $.browser.msie ||
        $.browser.safari ? 'keydown' : 'keypress';

    if ($.browser.opera)
        $areaOpera = div().css({ width: '100%', height: '100%',
            position: 'absolute', zIndex: zIndex + 2 || 2 });

    $box.add($outer).css({ visibility: 'hidden', position: position,
        overflow: 'hidden', zIndex: zIndex || '0' });
    $box.css({ zIndex: zIndex + 2 || 2 });
    $area.add($border).css({ position: 'absolute', fontSize: 0 });

    img.complete || img.readyState == 'complete' || !$img.is('img') ?
        imgLoad() : $img.one('load', imgLoad);
};

$.fn.imgAreaSelect = function (options) {
    options = options || {};

    this.each(function () {
        if ($(this).data('imgAreaSelect')) {
            if (options.remove) {
                $(this).data('imgAreaSelect').remove();
                $(this).removeData('imgAreaSelect');
            }
            else
                $(this).data('imgAreaSelect').setOptions(options);
        }
        else if (!options.remove) {
            if (options.enable === undefined && options.disable === undefined)
                options.enable = true;

            $(this).data('imgAreaSelect', new $.imgAreaSelect(this, options));
        }
    });

    if (options.instance)
        return $(this).data('imgAreaSelect');

    return this;
};

})(jQuery);
/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.3.1
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2010-01-23
 * @link    http://jscolor.com
 */


var jscolor = {


  dir : '../img/', // location of jscolor directory (leave empty to autodetect)
  bindClass : 'color', // class name
  binding : true, // automatic binding via <input class="...">
  preloading : true, // use image preloading?


  install : function() {
    jscolor.addEvent(window, 'load', jscolor.init);
  },


  init : function() {
    if(jscolor.binding) {
      jscolor.bind();
    }
    if(jscolor.preloading) {
      jscolor.preload();
    }
  },


  getDir : function() {
    if(!jscolor.dir) {
      var detected = jscolor.detectDir();
      jscolor.dir = detected!==false ? detected : 'jscolor/';
    }
    return jscolor.dir;
  },


  detectDir : function() {
    var base = location.href;

    var e = document.getElementsByTagName('base');
    for(var i=0; i<e.length; i+=1) {
      if(e[i].href) { base = e[i].href; }
    }

    var e = document.getElementsByTagName('script');
    for(var i=0; i<e.length; i+=1) {
      if(e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
        var src = new jscolor.URI(e[i].src);
        var srcAbs = src.toAbsolute(base);
        srcAbs.path = srcAbs.path.replace(/[^\/]+$/, ''); // remove filename
        srcAbs.query = null;
        srcAbs.fragment = null;
        return srcAbs.toString();
      }
    }
    return false;
  },


  bind : function() {
    var matchClass = new RegExp('(^|\\s)('+jscolor.bindClass+')\\s*(\\{[^}]*\\})?', 'i');
    var e = document.getElementsByTagName('input');
    for(var i=0; i<e.length; i+=1) {
      var m;
      if(!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
        var prop = {};
        if(m[3]) {
          try {
            eval('prop='+m[3]);
          } catch(eInvalidProp) {}
        }
        e[i].color = new jscolor.color(e[i], prop);
      }
    }
  },


  preload : function() {
    for(var fn in jscolor.imgRequire) {
      if(jscolor.imgRequire.hasOwnProperty(fn)) {
        jscolor.loadImage(fn);
      }
    }
  },


  images : {
    pad : [ 181, 101 ],
    sld : [ 16, 101 ],
    cross : [ 15, 15 ],
    arrow : [ 7, 11 ]
  },


  imgRequire : {},
  imgLoaded : {},


  requireImage : function(filename) {
    jscolor.imgRequire[filename] = true;
  },


  loadImage : function(filename) {
    if(!jscolor.imgLoaded[filename]) {
      jscolor.imgLoaded[filename] = new Image();
      jscolor.imgLoaded[filename].src = jscolor.getDir()+filename;
    }
  },


  fetchElement : function(mixed) {
    return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
  },


  addEvent : function(el, evnt, func) {
    if(el.addEventListener) {
      el.addEventListener(evnt, func, false);
    } else if(el.attachEvent) {
      el.attachEvent('on'+evnt, func);
    }
  },


  fireEvent : function(el, evnt) {
    if(!el) {
      return;
    }
    if(document.createEventObject) {
      var ev = document.createEventObject();
      el.fireEvent('on'+evnt, ev);
    } else if(document.createEvent) {
      var ev = document.createEvent('HTMLEvents');
      ev.initEvent(evnt, true, true);
      el.dispatchEvent(ev);
    } else if(el['on'+evnt]) { // alternatively use the traditional event model (IE5)
      el['on'+evnt]();
    }
  },


  getElementPos : function(e) {
    var e1=e, e2=e;
    var x=0, y=0;
    if(e1.offsetParent) {
      do {
        x += e1.offsetLeft;
        y += e1.offsetTop;
      } while(e1 = e1.offsetParent);
    }
    while((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
      x -= e2.scrollLeft;
      y -= e2.scrollTop;
    }
    return [x, y];
  },


  getElementSize : function(e) {
    return [e.offsetWidth, e.offsetHeight];
  },


  getMousePos : function(e) {
    if(!e) { e = window.event; }
    if(typeof e.pageX === 'number') {
      return [e.pageX, e.pageY];
    } else if(typeof e.clientX === 'number') {
      return [
        e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
        e.clientY + document.body.scrollTop + document.documentElement.scrollTop
      ];
    }
  },


  getViewPos : function() {
    if(typeof window.pageYOffset === 'number') {
      return [window.pageXOffset, window.pageYOffset];
    } else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
      return [document.body.scrollLeft, document.body.scrollTop];
    } else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
      return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
    } else {
      return [0, 0];
    }
  },


  getViewSize : function() {
    if(typeof window.innerWidth === 'number') {
      return [window.innerWidth, window.innerHeight];
    } else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
      return [document.body.clientWidth, document.body.clientHeight];
    } else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      return [document.documentElement.clientWidth, document.documentElement.clientHeight];
    } else {
      return [0, 0];
    }
  },


  URI : function(uri) { // See RFC3986

    this.scheme = null;
    this.authority = null;
    this.path = '';
    this.query = null;
    this.fragment = null;

    this.parse = function(uri) {
      var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
      this.scheme = m[3] ? m[2] : null;
      this.authority = m[5] ? m[6] : null;
      this.path = m[7];
      this.query = m[9] ? m[10] : null;
      this.fragment = m[12] ? m[13] : null;
      return this;
    };

    this.toString = function() {
      var result = '';
      if(this.scheme !== null) { result = result + this.scheme + ':'; }
      if(this.authority !== null) { result = result + '//' + this.authority; }
      if(this.path !== null) { result = result + this.path; }
      if(this.query !== null) { result = result + '?' + this.query; }
      if(this.fragment !== null) { result = result + '#' + this.fragment; }
      return result;
    };

    this.toAbsolute = function(base) {
      var base = new jscolor.URI(base);
      var r = this;
      var t = new jscolor.URI;

      if(base.scheme === null) { return false; }

      if(r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
        r.scheme = null;
      }

      if(r.scheme !== null) {
        t.scheme = r.scheme;
        t.authority = r.authority;
        t.path = removeDotSegments(r.path);
        t.query = r.query;
      } else {
        if(r.authority !== null) {
          t.authority = r.authority;
          t.path = removeDotSegments(r.path);
          t.query = r.query;
        } else {
          if(r.path === '') { // TODO: == or === ?
            t.path = base.path;
            if(r.query !== null) {
              t.query = r.query;
            } else {
              t.query = base.query;
            }
          } else {
            if(r.path.substr(0,1) === '/') {
              t.path = removeDotSegments(r.path);
            } else {
              if(base.authority !== null && base.path === '') { // TODO: == or === ?
                t.path = '/'+r.path;
              } else {
                t.path = base.path.replace(/[^\/]+$/,'')+r.path;
              }
              t.path = removeDotSegments(t.path);
            }
            t.query = r.query;
          }
          t.authority = base.authority;
        }
        t.scheme = base.scheme;
      }
      t.fragment = r.fragment;

      return t;
    };

    function removeDotSegments(path) {
      var out = '';
      while(path) {
        if(path.substr(0,3)==='../' || path.substr(0,2)==='./') {
          path = path.replace(/^\.+/,'').substr(1);
        } else if(path.substr(0,3)==='/./' || path==='/.') {
          path = '/'+path.substr(3);
        } else if(path.substr(0,4)==='/../' || path==='/..') {
          path = '/'+path.substr(4);
          out = out.replace(/\/?[^\/]*$/, '');
        } else if(path==='.' || path==='..') {
          path = '';
        } else {
          var rm = path.match(/^\/?[^\/]*/)[0];
          path = path.substr(rm.length);
          out = out + rm;
        }
      }
      return out;
    }

    if(uri) {
      this.parse(uri);
    }

  },


  /*
   * Usage example:
   * var myColor = new jscolor.color(myInputElement)
   */

  color : function(target, prop) {


    this.required = true; // refuse empty values?
    this.adjust = true; // adjust value to uniform notation?
    this.hash = false; // prefix color with # symbol?
    this.caps = true; // uppercase?
    this.valueElement = target; // value holder
    this.styleElement = target; // where to reflect current color
    this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
    this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1

    this.pickerOnfocus = true; // display picker on focus?
    this.pickerMode = 'HSV'; // HSV | HVS
    this.pickerPosition = 'bottom'; // left | right | top | bottom
    this.pickerFace = 10; // px
    this.pickerFaceColor = 'ThreeDFace'; // CSS color
    this.pickerBorder = 1; // px
    this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
    this.pickerInset = 1; // px
    this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
    this.pickerZIndex = 10000;


    for(var p in prop) {
      if(prop.hasOwnProperty(p)) {
        this[p] = prop[p];
      }
    }


    this.hidePicker = function() {
      if(isPickerOwner()) {
        removePicker();
      }
    };


    this.showPicker = function() {
      if(!isPickerOwner()) {
        var tp = jscolor.getElementPos(target); // target pos
        var ts = jscolor.getElementSize(target); // target size
        var vp = jscolor.getViewPos(); // view pos
        var vs = jscolor.getViewSize(); // view size
        var ps = [ // picker size
          2*this.pickerBorder + 4*this.pickerInset + 2*this.pickerFace + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + jscolor.images.sld[0],
          2*this.pickerBorder + 2*this.pickerInset + 2*this.pickerFace + jscolor.images.pad[1]
        ];
        var a, b, c;
        switch(this.pickerPosition.toLowerCase()) {
          case 'left': a=1; b=0; c=-1; break;
          case 'right':a=1; b=0; c=1; break;
          case 'top':  a=0; b=1; c=-1; break;
          default:     a=0; b=1; c=1; break;
        }
        var l = (ts[b]+ps[b])/2;
        var pp = [ // picker pos
          -vp[a]+tp[a]+ps[a] > vs[a] ?
            (-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
            tp[a],
          -vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
            (-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
            (tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
        ];
        drawPicker(pp[a], pp[b]);
      }
    };


    this.importColor = function() {
      if(!valueElement) {
        this.exportColor();
      } else {
        if(!this.adjust) {
          if(!this.fromString(valueElement.value, leaveValue)) {
            styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
            styleElement.style.color = styleElement.jscStyle.color;
            this.exportColor(leaveValue | leaveStyle);
          }
        } else if(!this.required && /^\s*$/.test(valueElement.value)) {
          valueElement.value = '';
          styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
          styleElement.style.color = styleElement.jscStyle.color;
          this.exportColor(leaveValue | leaveStyle);

        } else if(this.fromString(valueElement.value)) {
          // OK
        } else {
          this.exportColor();
        }
      }
    };


    this.exportColor = function(flags) {
      if(!(flags & leaveValue) && valueElement) {
        var value = this.toString();
        if(this.caps) { value = value.toUpperCase(); }
        if(this.hash) { value = '#'+value; }
        valueElement.value = value;
      }
      if(!(flags & leaveStyle) && styleElement) {
        styleElement.style.backgroundColor =
          '#'+this.toString();
        styleElement.style.color =
          0.213 * this.rgb[0] +
          0.715 * this.rgb[1] +
          0.072 * this.rgb[2]
          < 0.5 ? '#FFF' : '#000';
      }
      if(!(flags & leavePad) && isPickerOwner()) {
        redrawPad();
      }
      if(!(flags & leaveSld) && isPickerOwner()) {
        redrawSld();
      }
    };


    this.fromHSV = function(h, s, v, flags) { // null = don't change
      h<0 && (h=0) || h>6 && (h=6);
      s<0 && (s=0) || s>1 && (s=1);
      v<0 && (v=0) || v>1 && (v=1);
      this.rgb = HSV_RGB(
        h===null ? this.hsv[0] : (this.hsv[0]=h),
        s===null ? this.hsv[1] : (this.hsv[1]=s),
        v===null ? this.hsv[2] : (this.hsv[2]=v)
      );
      this.exportColor(flags);
    };


    this.fromRGB = function(r, g, b, flags) { // null = don't change
      r<0 && (r=0) || r>1 && (r=1);
      g<0 && (g=0) || g>1 && (g=1);
      b<0 && (b=0) || b>1 && (b=1);
      var hsv = RGB_HSV(
        r===null ? this.rgb[0] : (this.rgb[0]=r),
        g===null ? this.rgb[1] : (this.rgb[1]=g),
        b===null ? this.rgb[2] : (this.rgb[2]=b)
      );
      if(hsv[0] !== null) {
        this.hsv[0] = hsv[0];
      }
      if(hsv[2] !== 0) {
        this.hsv[1] = hsv[1];
      }
      this.hsv[2] = hsv[2];
      this.exportColor(flags);
    };


    this.fromString = function(hex, flags) {
      var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
      if(!m) {
        return false;
      } else {
        if(m[1].length === 6) { // 6-char notation
          this.fromRGB(
            parseInt(m[1].substr(0,2),16) / 255,
            parseInt(m[1].substr(2,2),16) / 255,
            parseInt(m[1].substr(4,2),16) / 255,
            flags
          );
        } else { // 3-char notation
          this.fromRGB(
            parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255,
            parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255,
            parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255,
            flags
          );
        }
        return true;
      }
    };


    this.toString = function() {
      return (
        (0x100 | Math.round(255*this.rgb[0])).toString(16).substr(1) +
        (0x100 | Math.round(255*this.rgb[1])).toString(16).substr(1) +
        (0x100 | Math.round(255*this.rgb[2])).toString(16).substr(1)
      );
    };


    function RGB_HSV(r, g, b) {
      var n = Math.min(Math.min(r,g),b);
      var v = Math.max(Math.max(r,g),b);
      var m = v - n;
      if(m === 0) { return [ null, 0, v ]; }
      var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
      return [ h===6?0:h, m/v, v ];
    }


    function HSV_RGB(h, s, v) {
      if(h === null) { return [ v, v, v ]; }
      var i = Math.floor(h);
      var f = i%2 ? h-i : 1-(h-i);
      var m = v * (1 - s);
      var n = v * (1 - s*f);
      switch(i) {
        case 6:
        case 0: return [v,n,m];
        case 1: return [n,v,m];
        case 2: return [m,v,n];
        case 3: return [m,n,v];
        case 4: return [n,m,v];
        case 5: return [v,m,n];
      }
    }


    function removePicker() {
      delete jscolor.picker.owner;
      document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB);
    }


    function drawPicker(x, y) {
      if(!jscolor.picker) {
        jscolor.picker = {
          box : document.createElement('div'),
          boxB : document.createElement('div'),
          pad : document.createElement('div'),
          padB : document.createElement('div'),
          padM : document.createElement('div'),
          sld : document.createElement('div'),
          sldB : document.createElement('div'),
          sldM : document.createElement('div')
        };
        for(var i=0,segSize=4; i<jscolor.images.sld[1]; i+=segSize) {
          var seg = document.createElement('div');
          seg.style.height = segSize+'px';
          seg.style.fontSize = '1px';
          seg.style.lineHeight = '0';
          jscolor.picker.sld.appendChild(seg);
        }
        jscolor.picker.sldB.appendChild(jscolor.picker.sld);
        jscolor.picker.box.appendChild(jscolor.picker.sldB);
        jscolor.picker.box.appendChild(jscolor.picker.sldM);
        jscolor.picker.padB.appendChild(jscolor.picker.pad);
        jscolor.picker.box.appendChild(jscolor.picker.padB);
        jscolor.picker.box.appendChild(jscolor.picker.padM);
        jscolor.picker.boxB.appendChild(jscolor.picker.box);
      }

      var p = jscolor.picker;

      // recompute controls positions
      posPad = [
        x+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset,
        y+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset ];
      posSld = [
        null,
        y+THIS.pickerBorder+THIS.pickerFace+THIS.pickerInset ];

      // controls interaction
      p.box.onmouseup =
      p.box.onmouseout = function() { target.focus(); };
      p.box.onmousedown = function() { abortBlur=true; };
      p.box.onmousemove = function(e) { holdPad && setPad(e); holdSld && setSld(e); };
      p.padM.onmouseup =
      p.padM.onmouseout = function() { if(holdPad) { holdPad=false; jscolor.fireEvent(valueElement,'change'); } };
      p.padM.onmousedown = function(e) { holdPad=true; setPad(e); };
      p.sldM.onmouseup =
      p.sldM.onmouseout = function() { if(holdSld) { holdSld=false; jscolor.fireEvent(valueElement,'change'); } };
      p.sldM.onmousedown = function(e) { holdSld=true; setSld(e); };

      // picker
      p.box.style.width = 4*THIS.pickerInset + 2*THIS.pickerFace + jscolor.images.pad[0] + 2*jscolor.images.arrow[0] + jscolor.images.sld[0] + 'px';
      p.box.style.height = 2*THIS.pickerInset + 2*THIS.pickerFace + jscolor.images.pad[1] + 'px';

      // picker border
      p.boxB.style.position = 'absolute';
      p.boxB.style.clear = 'both';
      p.boxB.style.left = x+'px';
      p.boxB.style.top = y+'px';
      p.boxB.style.zIndex = THIS.pickerZIndex;
      p.boxB.style.border = THIS.pickerBorder+'px solid';
      p.boxB.style.borderColor = THIS.pickerBorderColor;
      p.boxB.style.background = THIS.pickerFaceColor;

      // pad image
      p.pad.style.width = jscolor.images.pad[0]+'px';
      p.pad.style.height = jscolor.images.pad[1]+'px';

      // pad border
      p.padB.style.position = 'absolute';
      p.padB.style.left = THIS.pickerFace+'px';
      p.padB.style.top = THIS.pickerFace+'px';
      p.padB.style.border = THIS.pickerInset+'px solid';
      p.padB.style.borderColor = THIS.pickerInsetColor;

      // pad mouse area
      p.padM.style.position = 'absolute';
      p.padM.style.left = '0';
      p.padM.style.top = '0';
      p.padM.style.width = THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
      p.padM.style.height = p.box.style.height;
      p.padM.style.cursor = 'crosshair';

      // slider image
      p.sld.style.overflow = 'hidden';
      p.sld.style.width = jscolor.images.sld[0]+'px';
      p.sld.style.height = jscolor.images.sld[1]+'px';

      // slider border
      p.sldB.style.position = 'absolute';
      p.sldB.style.right = THIS.pickerFace+'px';
      p.sldB.style.top = THIS.pickerFace+'px';
      p.sldB.style.border = THIS.pickerInset+'px solid';
      p.sldB.style.borderColor = THIS.pickerInsetColor;

      // slider mouse area
      p.sldM.style.position = 'absolute';
      p.sldM.style.right = '0';
      p.sldM.style.top = '0';
      p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2*THIS.pickerInset + 'px';
      p.sldM.style.height = p.box.style.height;
      try {
        p.sldM.style.cursor = 'pointer';
      } catch(eOldIE) {
        p.sldM.style.cursor = 'hand';
      }

      // load images in optimal order
      switch(modeID) {
        case 0: var padImg = 'jquery.jscolor.hs.png'; break;
        case 1: var padImg = 'jquery.jscolor.hv.png'; break;
      }
      p.padM.style.background = "url('"+jscolor.getDir()+"jquery.jscolor.cross.gif') no-repeat";
      p.sldM.style.background = "url('"+jscolor.getDir()+"jquery.jscolor.arrow.gif') no-repeat";
      p.pad.style.background = "url('"+jscolor.getDir()+padImg+"') 0 0 no-repeat";

      // place pointers
      redrawPad();
      redrawSld();

      jscolor.picker.owner = THIS;
      document.getElementsByTagName('body')[0].appendChild(p.boxB);
    }


    function redrawPad() {
      // redraw the pad pointer
      switch(modeID) {
        case 0: var yComponent = 1; break;
        case 1: var yComponent = 2; break;
      }
      var x = Math.round((THIS.hsv[0]/6) * (jscolor.images.pad[0]-1));
      var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.pad[1]-1));
      jscolor.picker.padM.style.backgroundPosition =
        (THIS.pickerFace+THIS.pickerInset+x - Math.floor(jscolor.images.cross[0]/2)) + 'px ' +
        (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.cross[1]/2)) + 'px';

      // redraw the slider image
      var seg = jscolor.picker.sld.childNodes;

      switch(modeID) {
        case 0:
          var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
          for(var i=0; i<seg.length; i+=1) {
            seg[i].style.backgroundColor = 'rgb('+
              (rgb[0]*(1-i/seg.length)*100)+'%,'+
              (rgb[1]*(1-i/seg.length)*100)+'%,'+
              (rgb[2]*(1-i/seg.length)*100)+'%)';
          }
          break;
        case 1:
          var rgb, s, c = [ THIS.hsv[2], 0, 0 ];
          var i = Math.floor(THIS.hsv[0]);
          var f = i%2 ? THIS.hsv[0]-i : 1-(THIS.hsv[0]-i);
          switch(i) {
            case 6:
            case 0: rgb=[0,1,2]; break;
            case 1: rgb=[1,0,2]; break;
            case 2: rgb=[2,0,1]; break;
            case 3: rgb=[2,1,0]; break;
            case 4: rgb=[1,2,0]; break;
            case 5: rgb=[0,2,1]; break;
          }
          for(var i=0; i<seg.length; i+=1) {
            s = 1 - 1/(seg.length-1)*i;
            c[1] = c[0] * (1 - s*f);
            c[2] = c[0] * (1 - s);
            seg[i].style.backgroundColor = 'rgb('+
              (c[rgb[0]]*100)+'%,'+
              (c[rgb[1]]*100)+'%,'+
              (c[rgb[2]]*100)+'%)';
          }
          break;
      }
    }


    function redrawSld() {
      // redraw the slider pointer
      switch(modeID) {
        case 0: var yComponent = 2; break;
        case 1: var yComponent = 1; break;
      }
      var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.sld[1]-1));
      jscolor.picker.sldM.style.backgroundPosition =
        '0 ' + (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.arrow[1]/2)) + 'px';
    }


    function isPickerOwner() {
      return jscolor.picker && jscolor.picker.owner === THIS;
    }


    function blurTarget() {
      if(valueElement === target) {
        THIS.importColor();
      }
      if(THIS.pickerOnfocus) {
        THIS.hidePicker();
      }
    }


    function blurValue() {
      if(valueElement !== target) {
        THIS.importColor();
      }
    }


    function setPad(e) {
      var posM = jscolor.getMousePos(e);
      var x = posM[0]-posPad[0];
      var y = posM[1]-posPad[1];
      switch(modeID) {
        case 0: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), 1 - y/(jscolor.images.pad[1]-1), null, leaveSld); break;
        case 1: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), null, 1 - y/(jscolor.images.pad[1]-1), leaveSld); break;
      }
    }


    function setSld(e) {
      var posM = jscolor.getMousePos(e);
      var y = posM[1]-posPad[1];
      switch(modeID) {
        case 0: THIS.fromHSV(null, null, 1 - y/(jscolor.images.sld[1]-1), leavePad); break;
        case 1: THIS.fromHSV(null, 1 - y/(jscolor.images.sld[1]-1), null, leavePad); break;
      }
    }


    var THIS = this;
    var modeID = this.pickerMode.toLowerCase()==='hvs' ? 1 : 0;
    var abortBlur = false;
    var
      valueElement = jscolor.fetchElement(this.valueElement),
      styleElement = jscolor.fetchElement(this.styleElement);
    var
      holdPad = false,
      holdSld = false;
    var
      posPad,
      posSld;
    var
      leaveValue = 1<<0,
      leaveStyle = 1<<1,
      leavePad = 1<<2,
      leaveSld = 1<<3;

    // target
    jscolor.addEvent(target, 'focus', function() {
      if(THIS.pickerOnfocus) { THIS.showPicker(); }
    });
    jscolor.addEvent(target, 'blur', function() {
      if(!abortBlur) {
        window.setTimeout(function(){ abortBlur || blurTarget(); abortBlur=false; }, 0);
      } else {
        abortBlur = false;
      }
    });

    // valueElement
    if(valueElement) {
      var updateField = function() {
        THIS.fromString(valueElement.value, leaveValue);
      };
      jscolor.addEvent(valueElement, 'keyup', updateField);
      jscolor.addEvent(valueElement, 'input', updateField);
      jscolor.addEvent(valueElement, 'blur', blurValue);
      valueElement.setAttribute('autocomplete', 'off');
    }

    // styleElement
    if(styleElement) {
      styleElement.jscStyle = {
        backgroundColor : styleElement.style.backgroundColor,
        color : styleElement.style.color
      };
    }

    // require images
    switch(modeID) {
      case 0: jscolor.requireImage('jquery.jscolor.hs.png'); break;
      case 1: jscolor.requireImage('jquery.jscolor.hv.png'); break;
    }
    jscolor.requireImage('jquery.jscolor.cross.gif');
    jscolor.requireImage('jquery.jscolor.arrow.gif');

    this.importColor();
  }

};


jscolor.install();
(function($){
/*
 * mLightBox
 *
 * Require Library:
 * 　jquery.js 1.3.2
 *
 * Options:
 * 　mLightBoxId - LightBoxとして表示させたい要素ID
 * 　duration - LightBoxの表示速度
 * 　easing - LightBoxのeasingタイプ
 * 　zIndex - LightBoxのz-index値
 * 　callback - コールバック関数を指定してください、型はfunctionです
 * 　
 * Description:
 * 　簡易的なLightBox機能を提供します
 * 　
 * Browser:
 *  Windows - IE6.0, IE7.0, IE8.0, Firefox3.5, Safari3.1, Opera9.6
 *  Mac - Firefox3.5, Safari5, Opera9.6
 *
 */

var options = {
		mLightBoxId: null,
		duration: null,
		easing: null,
		zIndex: null,
		callback: function(){},
		resizebeforeback: function(){},
		closecallback: function(){}
	},

	// default z-index
	DEFAULT_ZINDEX = 1000,

	// default duration
	DEFAULT_DURATION = 100,

	// default easing type
	DEFAULT_EASING = "swing",

	// overlay element id
	overlayId = "jquery-mLightBox-overlay"

	;

$.mLightBox = function(opts){
	$.extend(options, opts);
	$.ui.mLightBox(this, options);
}

$.ui = $.ui || {};

$.ui.mLightBox = function(container, options){
	_hideSelectBox();

	var winDimension = ___getPageSize();

	// overlay
	var overlay = $('<div>')
		.attr("id", overlayId)
		.css({
			position: "absolute", top: "0px", left: "0px",
			backgroundColor: "#000000", opacity: "0",
			width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px",
			zIndex: options.zIndex || DEFAULT_ZINDEX
		})
		.click(function(){
			close(options.closecallback);
		})
		.appendTo("body")
		.animate({opacity: 0.4}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING
		});

	// mLightBox
	var mLightBox = $(options.mLightBoxId);

	animation(mLightBox, __elemOffset(mLightBox));

	__winResize(overlay, mLightBox);
}

$.mLightBox.changeLayer = function(opts){
	$(options.mLightBoxId).hide();
	$.extend(options, opts);

	// mLightBox
	var mLightBox = $(options.mLightBoxId);

	animation(mLightBox, __elemOffset(mLightBox));

	__winResize($(overlayId), mLightBox);
}

$.mLightBox.close = function(fn) {
	close(fn);
}

function close(fn){
	// overlay
	$("#" + overlayId)
		.animate({
			opacity: 0
		}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				_showSelectBox();
				$(this).remove();
		}
	});

	// mLightBox
	$(options.mLightBoxId)
		.animate({ opacity: 0 }, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				$(this).hide();
				(fn || function(){}).apply(this, arguments);
		}
	});
}

function __winResize(overlay, mLightBox) {
	$(window).resize(function(){
		options.resizebeforeback();

		// overlay
		var winDimension = ___getPageSize();
		overlay.css({width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px"});

		// mLightBox
		var offset = __elemOffset(mLightBox);
		mLightBox.css({top: offset.top, left: offset.left});
	});
}

// LigithBox animate!!
function animation(element, offset) {
	element
		.attr("ng-controller", "DialogCtrl")
		.css({
			opacity: 1,
			left: offset.left + "px", top: offset.top,
			zIndex: (options.zIndex || DEFAULT_ZINDEX) + 1 })
		.show()
		.animate({ opacity: 1}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				options.callback.apply(this, arguments);
				$(this).find("input:first").focus();
			}
		});
}

/**
 * getPageSize()
 *
 */
function ___getPageSize() {
	// スクロール領域を含むwidth
	var pageWidth  = 0;
	if ($.browser && $.browser.safari) {
		pageWidth = document.body.scrollWidth;
	} else {
		pageWidth = document.documentElement.scrollWidth;
	}

	// スクロール領域を含むheight
	var pageHeight = 0;
	if ($.browser && $.browser.safari) {
		pageHeight = document.body.scrollHeight;
	} else {
		pageHeight = document.documentElement.scrollHeight;
	}

	// 画面に表示されている領域のwidth
	var windowWidth = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;

	// 画面に表示されている領域のheight
	var windowHeight = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;

	return {
		pageWidth: pageWidth, pageHeight: pageHeight,
		winWidth: windowWidth, winHeight: windowHeight
	};
}

function __elemOffset(element) {
	var top = Math.floor($(window).scrollTop() + ($(window).height() - $(element).height()) / 2);
	if ($(window).height() < $(element).height()) {
		top = Math.floor($(window).scrollTop());
	}
	var left = Math.floor($(window).scrollLeft() + ($(window).width() - $(element).width()) / 2);
	
	return {
		top: top,
		left: left
	};
}

// ie6 require
var display = [];
function _hideSelectBox() {
	if($.browser && $.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			display[index] = $(this).css("visibility");
			$(this).css("visibility", "hidden");
		});
	}
}

function _showSelectBox() {
	if($.browser && $.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			$(this).css("visibility", display[index]);
		});
	}
}

})(jQuery);

(function($) {
/*
 * makeUri
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLからドメインを除去し、getパラメータを分割します。
 */
$.makeUri = function(href, addParam){
	var url =  $.rejectDomain(href);

	var idx;
	idx = url.indexOf("#");
	url = (idx < 0) ? url : url.substr(0, idx);		// #より前の部分のURLを抽出

	idx = url.indexOf("?");
	var uri = (idx < 0) ? url : url.substr(0, idx);	// ?より前の部分のURLを抽出

	// すでにgetパラメータがあるならそのまま配列に突っ込む
	var param = (idx < 0) ? [] : url.substr(idx + 1).split("&");

	// 追加したいgetパラメータをpushする
	if (addParam) {
		for (var i=0,len=addParam.length; i<len; ++i) {
			param.push(addParam[i]);
		}
	}

	return { uri: uri, param: param }
};

})(jQuery);


(function($) {
/*
 * rejectDomain
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLからドメイン部分を除去します。
 */
$.rejectDomain = function(url){
	if(!url) return null;

	var idx;

	idx = url.indexOf("/");
	if(idx == 0) return url;

	var baseurl = [location.protocol, "//", location.host].join('');
	idx = url.indexOf(baseurl);

	if(idx != 0) return "";

	return url.substr(baseurl.length);
};

})(jQuery);

(function($) {
/*
 * rejectFragmentId
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLから#以降、?以降を除去します。
 */
$.rejectFragmentId = function(url){
	if(!url) return null;

	var idx;
	idx = url.indexOf("#");
	url = (idx < 0) ? url : url.substr(0, idx);

	idx = url.indexOf("?");

	return (idx < 0) ? url : url.substr(0, idx);
};

})(jQuery);

(function($) {
/*
 * uriParamJoin
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * paramがある場合は?を、paramが複数ある場合は&で繋ぐ
 */
$.uriParamJoin = function(url, param){
	var addParam = $.compact(param);

	return addParam.length > 0 ? [url, addParam.join("&")].join("?") : url;
};

})(jQuery);


(function($){
/*
 * compact
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * 配列からnull、undefine、""を除去します。（もっとDeepな感じのほうが便利かな？）
 */

$.compact = function(object) {
	if (object.constructor != Array) { return }

	var ret = new Array();
	for (var i=0,len=object.length; i<len; ++i) {
		if (object[i] !== null && object[i] !== undefined && object[i] !== "") {
			ret.push(object[i]);
		}
	}

	return ret;
}

})(jQuery);


;(function($) {
/*
 * メッセージ
 *
 * 	$.message({
 *		text: "こんにちわ"
 *  });

 */
$.message = function(opts) {

	var options = $.extend({
			text: "",
			id: "#message"
		}, opts),
	timeout = null;

	clearTimeout(options.timeout);

	var elem = $(options.id);
	var top  = 50,
		left = Math.floor($(window).scrollLeft() + ($(window).width() - elem.width() - 20));

	elem.stop().hide().css({
		position: "absolute",
		top: top + "px",
		left: Math.floor($(window).scrollLeft() + ($(window).width() + elem.width())) + "px",
		"z-index": 5000
	});

	$(options.id).html(options.text);

	elem.show().animate({
		top: top + "px",
		left: left + "px"
	}, 300, "easeOutBack", function(){

		options.timeout = setTimeout(function() {
			elem.animate({
				top: top + "px",
				left: Math.floor($(window).scrollLeft() + ($(window).width() + elem.width())) + "px"
			}, 300, "easeOutBack", function(){
				$(this).hide();
			});
		}, 2000);
	});
};

})(jQuery);

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


(function($) {
	/*
	 * mynavislider *
	 * Copyright (c) 2013 iseyoshitaka
	 *
	 * Description:
	 *  画像スライダー
	 *
	 * Sample:
	 * $('#thumbs').mynavislider({
	 * 	'easing': 'easeInOutCirc'
	 * ,	'duration': 150
	 * ,	'shift':	5
	 * });
	 */
	$.fn.mynavislider = function(options) {

		$.fn.mynavislider.defaults = {
		'separator' : this
		,	'parentKey': 'ul' // 親要素
		,	'childKey': 'li' // 子要素
		,	'shift': 5 // 1度にスライドさせるページ数
		,	'shiftw': null // 1度にスライドさせる幅
		,	'slideSpeed': 300 // スライド速度
		,	'easing': 'easeInOutCirc' // アニメーションの種類
		,	'carousel': false // 回転させるかどうか
		,	'backBtnKey': '#gallery-back' // 次ページボタン
		,	'nextBtnKey': '#gallery-next' // 前ページボタン
		,	'autoSlide': false // 自動スライドさせるどうか
		,	'autoSlideInterval':  8000 // 自動スライドさせる間隔(ミリ秒)
		,	'isMouseDrag': false // スワイプでのページングを可能にするかどうか
		,	'reboundw': 20 // スワイプ時に跳ね返りを行う幅
		,	'slideCallBack': null // スライド後に処理を行うコールバック
		};

		var screen = null // ギャラリー画像表示枠
		,	ul = null // ギャラリー用ULタグ
		,	li = null // ギャラリー用LIタグ
		,	back = null // 前へボタン
		,	next = null // 次へボタン
		,	pos = 0 // ギャラリーポジション
		,	pageNo = 1 // 現在のページ番号
		,	maxPageNo = 1 // 最大のページ番号
		,	liwidth = 0 // 子要素の横幅
		,	shiftw = 0 // 1度に移動させる幅
		,	nowLoading = false // スライド処理中かどうか
		,	dragw = 0; // ドラッグした横幅

		var params = $.extend({}, $.fn.mynavislider.defaults, options);

		var ANIMATE_TYPE = {
			NO: 0,
			SLIDE: 1,
			FADE: 2
		};

		// jQueryオブジェクトキャッシュ、移動量の初期設定を行う
		var init = function(obj) {
			screen = $(obj);
			back = $(params.backBtnKey);
			next = $(params.nextBtnKey);
			ul = screen.find(params.parentKey);
			li = ul.find(params.childKey);
			if (params.shiftw) {
				liwidth = Math.ceil(params.shiftw/params.shift);
				shiftw = params.shiftw;
			} else {
				liwidth = li.width();
				shiftw = liwidth * params.shift;
			}
			maxPageNo = Math.ceil(li.size()/params.shift);

			// １画像のみの場合のカルーセルには現状対応していない。
			if (maxPageNo <= 1) {
				params.carousel = false;
			}

			if (params.carousel) {
				// カルーセルの初期設定を行う
				initCarousel();
				pos = li.size()/2;
			} else {
				// ページングボタンの表示制御
				showArrows();
				pos = params.shift;
			}

			// ulタグの横幅を調整する
			ul.css('width', shiftw * li.size() / params.shift)
				.css('position', 'relative');

			// マウスドラッグでのページングを可能にする
			if (params.isMouseDrag) {
				bindMouseDragEvent();
			}

			// マウスクリックでのページングを可能にする
			bindMouseClickEvent();

			// 自動のページングを可能にする。
			if (params.autoSlide) {
				new autoSlide().start();
			}

		};

		// 画像ギャラリーをスライドする
		var slide = function(page, animateType) {

			if (!animateType) {
				animateType = ANIMATE_TYPE.NO;
			}

			// 後処理
			var after = function() {
				if (params.carousel) {
					doCarousel();
				}

				nowLoading = false;
				dragw = 0;

				// コールバック
				slideCallBack();
			};

			// 移動するページ量
			var move = page - pageNo;

			if (maxPageNo <= 1) {
				after();
				return;
			}

			// カルーセルがない場合で、次ページが存在しない場合は、処理させない
			if (!params.carousel) {
				if ((move < 0 && pageNo === 1) || (0 < move && pageNo === maxPageNo)) {
					after();
					return;
				}
			}

			nowLoading = true;

			var from = 0;
			if (params.carousel) {
				from = -1 * (pos/params.shift) * shiftw - dragw;
			} else {
				from = -1 * (pos-params.shift)/params.shift * shiftw - dragw;
			}
			var to = from - (shiftw * move) + dragw;

			pos = pos + (params.shift * move);

			// ページ番号
			if (page < 1) {
				pageNo = maxPageNo;
			} else if (maxPageNo < page) {
				pageNo = 1;
			} else {
				pageNo = page;
			}

			// ページングボタンの表示制御
			if (!params.carousel) {
				showArrows();
			}

			if (animateType === ANIMATE_TYPE.NO) {
				// アニメーションを利用しない
				if (1 < maxPageNo && params.carousel) {
					pos = page * params.shift + (li.size()/2) - params.shift;
					ul.css('left', '-' + (pos * liwidth) + 'px');
				} else {
					pos = page * params.shift;
					ul.css('left', '-' + ((pos - params.shift) * liwidth) + 'px');
				}
				after();
			} else if (animateType === ANIMATE_TYPE.SLIDE) {
				if (!params.isMouseDrag) {
					// jQueryを利用したアニメーション
					ul.animate(
						{ left: to}
					,	params.slideSpeed
					,	params.easing
					,	function() {
							after();
						}
					);
				} else {
					// jQueryを利用しないアニメーション(Androidでアニメーションが重いため)
					(function() {
						var self = this;

						var elem = ul[0];
						var begin = +new Date();
						var duration = params.slideSpeed;
						var easing = function(time, duration) {
							return -(time /= duration) * (time - 2);
						};
						var timer = setInterval(function() {
							var time = new Date() - begin;
							var _pos, _now;
							if (time > duration) {
								clearInterval(timer);
								_now = to;

								after();
								return;
							}
							else {
								_pos = easing(time, duration);
								_now = _pos * (to - from) + from;
							}
							elem.style.left = _now + 'px';
						}, 10);
					})();
				}
			} else if (animateType === ANIMATE_TYPE.FADE) {
				ul.animate({'opacity': 0 }, 300, function() {
					// アニメーションを利用しない
					if (1 < maxPageNo && params.carousel) {
						pos = page * params.shift + (li.size()/2) - params.shift;
						ul.css('left', '-' + (pos * liwidth) + 'px').animate({'opacity': 1}, 300);
					} else {
						pos = page * params.shift;
						ul.css('left', '-' + ((pos - params.shift) * liwidth) + 'px').animate({'opacity': 1}, 300);
					}
					after();
				});
			}

		};

		// 次へ、前へボタンの表示・非表示を切り替える
		var showArrows = function() {
			// 1ページしかない場合
			if (maxPageNo <= 1) {
				next.hide();
				back.hide();
			// 左端
			} else if (pageNo === 1) {
				next.show();
				back.hide();
			// 右端
			} else if (pageNo === maxPageNo) {
				back.show();
				next.hide();
			} else {
				back.show();
				next.show();
			}
		};

		// カルーセル用に両端に番兵を作成する
		var initCarousel = function() {

			// 最終ページに空きが出来る場合は空のLIダグを追加する
			var addSize = li.size()%params.shift;
			if (addSize !== 0) {
				for (var i=0, len=params.shift-addSize;i<len;i++) {
					ul.append(ul.find(params.childKey).filter(':first').clone().empty().css('width', liwidth).css('height', li.height()));
				}
				// liを再キャッシュ
				li = ul.find(params.childKey);
			}

			ul
				.append(li.clone().addClass('cloned'))
				.css('left', '-' + (liwidth*(li.size())) + 'px');

			// liを再キャッシュ
			li = ul.find(params.childKey);
		};

		// カルーセル
		var doCarousel = function() {
			// 左端
			if (pos === 0) {
				pos = (li.size()/2);
				ul.css('left', '-' + (liwidth*pos) + 'px');
			// 右端
			} else if (pos === (li.size()-params.shift)) {
				pos = (li.size()/2)-params.shift;
				ul.css('left', '-' + (liwidth*pos) + 'px');
			}
		};

		// マウスクリックでのページングを可能にする
		var bindMouseClickEvent = function() {
			// 左方向へスライドする
			back.click(function(e) {
				e.preventDefault();
				backPage();
			});

			// 右方向へスライドする
			next.click(function(e) {
				e.preventDefault();
				nextPage();
			});
		};

		// マウスドラッグでのページングを可能にする
		var bindMouseDragEvent = function() {
			var isTouch = ('ontouchstart' in window);
			ul.bind({
				// タッチの開始、マウスボタンを押したとき
				'touchstart mousedown': function(e) {

					if (nowLoading) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
					nowLoading = true;

					// 開始位置を覚えておく
					this.pageX= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);
					this.pageY= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY);
					this.left = $(this).position().left;
					this.startLeft = this.left;

					this.touched = true;
				},
				// タッチしながら移動、マウスのドラッグ
				'touchmove mousemove': function(e) {

					if (!this.touched) {
						return;
					}

					var x = (this.pageX - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX));
					var y = (this.pageY - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY));

					if (5 < Math.abs(x)) {
						event.preventDefault();
						event.stopPropagation();
					} else if (5 < Math.abs(y)) {
						return;
					}
					// 移動先の位置を取得する
					this.left = this.left - x;

					// 画像を移動させる
					$(this).css({left:this.left});

					// 位置 X,Y 座標を覚えておく
					this.pageX = ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);

				},
				// タッチの終了、マウスのドラッグの終了
				'touchend mouseup touchcancel': function(e) {
					if (!this.touched) {
						return;
					}
					this.touched = false;

					// スワイプの移動量
					dragw = this.startLeft - this.left;

					// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
					if ((Math.abs(dragw) < params.reboundw) || (!params.carousel && ((pageNo <= 1 && dragw < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
						ul.animate(
							{ left: '-=' + (-1 * dragw)},
							function() {
								nowLoading = false;
							}
						);
						dragw = 0;
					}

					if (dragw < 0) {
						// 前ページ
						slide(pageNo-1, ANIMATE_TYPE.SLIDE);
					} else if (0 < dragw) {
						// 次ページ
						slide(pageNo+1, ANIMATE_TYPE.SLIDE);
					} else {
						// 何もしない
					}
				}
			});
		};

		// 自動スライド
		var autoSlide = function() {
			this.start = function() {
				startTimer();
			};
			var startTimer = function() {
				timer = setTimeout(function() {
					clearInterval(timer);
					nextPage();
					startTimer();
				} , params.autoSlideInterval);
			};
			var stopTimer = function() {
				clearInterval(timer);
				timer = null;
			};
			// ページングボタンにマウスオーバーした際は、自動切り替えしない。
			$(params.backBtnKey + ',' + params.nextBtnKey).hover(
				function () {
					stopTimer();
				},
				function () {
					startTimer();
				}
			);
		};

		// コールバック
		var slideCallBack = function() {
			if (_.isFunction(params.slideCallBack)) {
				var data = {};
				data.pageNo = pageNo;
				data.maxPageNo = maxPageNo;
				if (params.carousel) {
					data.obj = $(li[pos]);
				} else {
					data.obj = $(li[(pos-params.shift)]);
				}
				params.slideCallBack(data);
			}
		};

		/* Public  */

		// 前ページを表示します。
		var backPage = this.backPage = function() {
			if (nowLoading) {
				return;
			}
			slide(pageNo-1, ANIMATE_TYPE.SLIDE);
		}

		// 次ページを表示します。
		var nextPage = this.nextPage = function() {
			if (nowLoading) {
				return;
			}
			slide(pageNo+1, ANIMATE_TYPE.SLIDE);
		}

		// 指定したページを表示します。
		this.changePage = function(page, animateType) {
			var page = parseInt(page) || 1;
			slide(page, animateType);
		}

		// 処理開始
		$(params.separator).each(function() {
			init(this);
		});

		return this;
	};

})(jQuery);


(function($) {

	/*
	 * placeholder
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * IEにてプレースホルダーに対応します。
	 * 参考サイト http://mths.be/placeholder v2.0.7 by @mathias
	 */
	var isInputSupported = 'placeholder' in document.createElement('input'),
	    isTextareaSupported = 'placeholder' in document.createElement('textarea'),
	    prototype = $.fn,
	    valHooks = $.valHooks,
	    hooks,
	    placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);
				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);
				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != document.activeElement) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		isInputSupported || (valHooks.input = hooks);
		isTextareaSupported || (valHooks.textarea = hooks);

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {},
		    rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this,
		    $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == document.activeElement && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement,
		    input = this,
		    $input = $(input),
		    $origInput = $input,
		    id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': true,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

})(jQuery);

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

(function($) {
	$.fn.rotate = function(angle,whence) {
		var p = this.get(0);

		// we store the angle inside the image tag for persistence
		if (!whence) {
			p.angle = ((p.angle==undefined?0:p.angle) + angle) % 360;
		} else {
			p.angle = angle;
		}

		if (p.angle >= 0) {
			var rotation = Math.PI * p.angle / 180;
		} else {
			var rotation = Math.PI * (360+p.angle) / 180;
		}
		var costheta = Math.cos(rotation);
		var sintheta = Math.sin(rotation);

		if (document.all && !window.opera) {
			var canvas = document.createElement('img');

			canvas.src = p.src;
			canvas.height = p.height;
			canvas.width = p.width;

			canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+costheta+",M12="+(-sintheta)+",M21="+sintheta+",M22="+costheta+",SizingMethod='auto expand')";
		} else {
			var canvas = document.createElement('canvas');
			if (!p.oImage) {
				canvas.oImage = new Image();
				canvas.oImage.src = p.src;
			} else {
				canvas.oImage = p.oImage;
			}

			canvas.style.width = canvas.width = Math.abs(costheta*canvas.oImage.width) + Math.abs(sintheta*canvas.oImage.height);
			canvas.style.height = canvas.height = Math.abs(costheta*canvas.oImage.height) + Math.abs(sintheta*canvas.oImage.width);

			var context = canvas.getContext('2d');
			context.save();
			if (rotation <= Math.PI/2) {
				context.translate(sintheta*canvas.oImage.height,0);
			} else if (rotation <= Math.PI) {
				context.translate(canvas.width,-costheta*canvas.oImage.height);
			} else if (rotation <= 1.5*Math.PI) {
				context.translate(-costheta*canvas.oImage.width,canvas.height);
			} else {
				context.translate(0,-sintheta*canvas.oImage.width);
			}
			context.rotate(rotation);
			context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
			context.restore();
		}
		canvas.id = p.id;
		canvas.angle = p.angle;
		p.parentNode.replaceChild(canvas, p);
	}

	$.fn.rotateRight = function(angle) {
		this.rotate(angle==undefined?90:angle);
	}

	$.fn.rotateLeft = function(angle) {
		this.rotate(angle==undefined?-90:-angle);
	}
})(jQuery);

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

/*
 * jQuery.upload v1.0.2
 *
 * Copyright (c) 2010 lagos
 * Dual licensed under the MIT and GPL licenses.
 *
 * http://lagoscript.org
 */
(function(b){function m(e){return b.map(n(e),function(d){return'<input type="hidden" name="'+d.name+'" value="'+d.value+'"/>'}).join("")}function n(e){function d(c,f){a.push({name:c,value:f})}if(b.isArray(e))return e;var a=[];if(typeof e==="object")b.each(e,function(c){b.isArray(this)?b.each(this,function(){d(c,this)}):d(c,b.isFunction(this)?this():this)});else typeof e==="string"&&b.each(e.split("&"),function(){var c=b.map(this.split("="),function(f){return decodeURIComponent(f.replace(/\+/g," "))});
d(c[0],c[1])});return a}function o(e,d){var a;a=b(e).contents().get(0);if(b.isXMLDoc(a)||a.XMLDocument)return a.XMLDocument||a;a=b(a).find("body").html();switch(d){case "xml":a=a;if(window.DOMParser)a=(new DOMParser).parseFromString(a,"application/xml");else{var c=new ActiveXObject("Microsoft.XMLDOM");c.async=false;c.loadXML(a);a=c}break;case "json":a=window.eval("("+a+")");break}return a}var p=0;b.fn.upload=function(e,d,a,c){var f=this,g,j,h;h="jquery_upload"+ ++p;var k=b('<iframe name="'+h+'" style="position:absolute;top:-9999px" />').appendTo("body"),
i='<form target="'+h+'" method="post" enctype="multipart/form-data" />';if(b.isFunction(d)){c=a;a=d;d={}}j=b("input:checkbox",this);h=b("input:checked",this);i=f.wrapAll(i).parent("form").attr("action",e);j.removeAttr("checked");h.attr("checked",true);g=(g=m(d))?b(g).appendTo(i):null;i.submit(function(){k.load(function(){var l=o(this,c),q=b("input:checked",f);i.after(f).remove();j.removeAttr("checked");q.attr("checked",true);g&&g.remove();setTimeout(function(){k.remove();c==="script"&&b.globalEval(l);
a&&a.call(f,l)},0)})}).submit();return this}})(jQuery);
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

