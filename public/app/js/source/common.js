var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-11964840-5']);
_gaq.push(['_trackPageview']);

(function ($, angular) {

	// アプリ内で利用するグローバル変数
	var App = {};

	// 通信クライアント
	App.client = undefined;

	// 画像ロールオーバー
	App.rollover = function(target) {
		var target = target || $('body');
		if(navigator.userAgent.indexOf("MSIE 8.") != -1) {
			// IE8対策(IE8でopacityを指定すると、透過した画像に黒枠が表示されてしまうため)
			target.find('.imgover').hover(
					function(){ $(this).css('-ms-filter','progid:DXImageTransform.Microsoft.Alpha(Opacity=75)'); },	
					function(){ $(this).css('-ms-filter','progid:DXImageTransform.Microsoft.Alpha(Opacity=100)'); }
				);
		} else {
			target.find('.imgover').hover(function(){$(this).fadeTo(100,0.75);},function(){$(this).fadeTo(100,1.0);});
		}
	};

	// ダイアログメッセージを表示します。
	App.openDialog = function(title, body, callback) {
		var id = 'dialogBox',
			target = $('#' + id);
		if (0<target.length) {
			target.remove();
		}

		target = $(['<div id="' + id + '" class="window display-none">',
				'<h2 class="caption">'+title+'</h2>',
				body,
				'<p class="close"><a href="#" class="icon icon-close imgover"></a></p>',
			'</div>'].join(''));
		target.appendTo('body');

		// ライトボックスの閉じるボタン
		$('.close', target).click(function(e) {
			e.preventDefault();
			$.mLightBox.close();
		});
		// ロールオーバー
		App.rollover(target);

		$.mLightBox({mLightBoxId: '#'+id,
			callback: function() {
				callback(target);
			},
			closecallback: function() {
			}
		});
	};

	// ダイアログメッセージを閉じます。
	App.closeDialog = function() {
		$.mLightBox.close();
	};

	// テキストカウンター
	App.textCounter = function() {
		$('.txtCounter').each(function() {
			var counter = $(this),
				max = counter.text(),
				box = counter.closest('div').find('input,textarea');
			box.charCount({
				allowed : max,
				counterTarget : counter,
				cssWarning: 'text-red'
			});
		});
	};

	// 画像パスを取得します
	App.getImageUrl = function(imageId, imageType, imageSize) {
		if (!imageId) {
			$.popupMessage({message:['引数不正']});
		}
		var type = '';
		if (imageType) {
			type = imageType.suffix || '';
			if (type !== '') {
				type = '_' + type;
			}
		}
		var size = '';
		if (imageSize) {
			size = imageSize.suffix || '';
			if (size !== '') {
				size = '_' + size;
			}
		}
		var dir1 = imageId.substr(0,2);
		var dir2 = imageId.substr(2,2);
		var dir3 = imageId.substr(4,2);
		var dirPath = dir1 + '/' + dir2 + '/' + dir3 + '/';
		var imageUrl = '/img/thumb/' + dirPath + imageId + type + size + '.jpg';
		return imageUrl;
	};

	// サーバーに接続
	App.client = new Client();

	// Angular.jsを設定
	App.angular = angular.module('phomix',[]);
	App.angular.controller('header', ['$scope', function($scope) {

		$scope.userMenu = {
			mypageUrl: '#',
			userName: '',
			userImagePath: '/img/noimage_m_sq.jpg'
		};

		// レスポンス処理
		App.client.handler.common = {};
		App.client.handler.common.autoLogin = function(data){
			if (!data || !data.userId) {
				return;
			}

			var userMenu = $('#js-userMenu,#js-menu');

			$scope.$apply(function() {
				$scope.userMenu.mypageUrl = '/u/'+data.userId+'/';
				$scope.userMenu.userName = data.name;
				$scope.userMenu.userImagePath = App.getImageUrl(data.imageId, App.Const.ImageType.SQUARE, App.Const.ImageSize.S);
			});
			userMenu.show();

			var target = $('.dropdown');
			userMenu.click(function(e) {
				e.stopPropagation();
				if(target.is(':visible')) {
				//	target.hide();
				} else {
					target.show();
				}
			});
			$('body').click(function(e) {
				if(target.is(':visible')) {
					target.hide();
				}
			});
		};

	}]);

	window.App = App;

	// DomReadyなバインドはここで設定
	$(function() {

		// 画像ロールオーバー
		App.rollover();

		// Google Analytics設定
		(function () {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();

		// facebookのoauth認証でリダイレクト先に#_=_という文字列がURL付与される対応
		if (window.location.hash == '#_=_') {
			window.location.hash = '';
		}

		// ページトップに戻るボタンを表示
		(function () {
			var showFlug = false;
			var topBtn = $('#pagetop');
			topBtn.css('bottom', '-100px');
			var showFlug = false;
			//スクロールが100に達したらボタン表示
			$(window).scroll(function () {
				if ($(this).scrollTop() > 100) {
					if (showFlug == false) {
						showFlug = true;
						topBtn.stop().animate({'bottom' : '20px'}, 200); 
					}
				} else {
					if (showFlug) {
						showFlug = false;
						topBtn.stop().animate({'bottom' : '-100px'}, 200); 
					}
				}
			});
			//スクロールしてトップ
			topBtn.click(function () {
				$('body,html').animate({
					scrollTop: 0
				}, 500);
				return false;
			});
		})();

	});

})(jQuery, angular);

