(function() {
	App.angular.controller('MainCtrl', ['$scope', function($scope) {

		// モデル
		$scope.user = {
			'name': '',
			'password': '',
			'email': '',
			'introduction': '',
			'imageId': ''
		};

		// 初期処理
		(function() {

			// テキストカウンター
			App.textCounter();

			// プレースホルダー
			$('input[placeholder], textarea[placeholder]').placeholder();
		})();

		var errdialog = function() {
			$.popupMessage({message: 'ブラウザの機能不足のため、指定の操作を実行できません。'});
		};

		// プロフィール画像
		var reader = new FileReader();
		$(reader).bind('loadend', function(e){
			App.client.send('loginRegister.registProfileImage', {files: e.target.result});
		});
		//$('#profileImage').drop(function(e){
		//	reader.readAsDataURL(e.dataTransfer.files[0]);
		//});
		var file = $($('<input type="file">').get(0));
		file.change(function(e){
			if ((typeof FileReader) == 'undefined') {
				errdialog();
				return false;
			}
			reader.readAsDataURL(e.target.files[0]);
		});

		// プロフィール画像のアップロード
		$scope.profileImageUpload = function(e){
			e.preventDefault();
			if ((typeof FileReader) == 'undefined') {
				errdialog();
				return false;
			}
			file.click();
		};

		// プロフィール画像の削除
		$scope.profileImageRemove = function(e){
			e.preventDefault();
			if ((typeof FileReader) == 'undefined') {
				errdialog();
				return false;
			}
			var profileImage = $('#profileImage').attr('src');
			var removeImage = $('.removeImage');
			removeImage.find('#deleteProfileImage').attr('src', profileImage);
			App.openDialog('プロフィール画像の削除',
				removeImage.html(), function(dialog) {
						$(dialog)
							.find('#remove-exec')
								.click(function(e){
									e.preventDefault();
									e.stopPropagation();
									// 削除処理
									App.client.send('loginRegister.deleteProfileImage', {imageId: $('#imageId').val()});
								})
							.end()
							;
					});
		};

		// プロフィール登録
		$scope.profileRegist = function(e){
			e.preventDefault();
			if ($scope.form1.$invalid) {
				$('form').find('.errors').show();
				return;
			}
			App.client.send('loginRegister.registProfile', $scope.user);
		};

		// レスポンス処理
		App.client.handler.loginRegister = {};
		App.client.handler.loginRegister.registProfileImage = function(data){
			$('#profileImage').attr('src', App.getImageUrl(data.imageId, App.Const.ImageType.SQUARE, App.Const.ImageSize.M));
			$scope.$apply(function() {
				$scope.user.imageId = data.imageId;
			});
			$('#remove').closest('p').show();
		};
		App.client.handler.loginRegister.deleteProfileImage = function(data){
			$('#remove').closest('p').hide();
			$scope.$apply(function() {
				$scope.user.imageId = '';
			});
			$('#profileImage').attr('src', '/img/noimage_m_sq.jpg');
			App.closeDialog();
		};
		App.client.handler.loginRegister.registProfile = function(data){
			$.cookie('accessToken', data.accessToken, { expires: 90, path: '/' });
			location.href = '/';
		};

	}]);
})();

