(function() {
	App.angular.controller('MainCtrl', ['$scope', function($scope) {

		// モデル
		$scope.user = {
			'email': '',
			'password': ''
		};

		// ログイン
		$scope.login = function(e){
			e.preventDefault();
			if ($scope.form1.$invalid) {
				$('form').find('.errors').show();
				return;
			}
			App.client.send('login.login', $scope.user);
		};

		// パスワードリマインダー
		$scope.showPasswdRemind = function(e){
			e.preventDefault();

			var target = $('#passwdRemind');
			App.openDialog('パスワードリマインド', target.html(), function(dialog) {
				angular.bootstrap(dialog[0], ['DialogApp']);
			});
		};

		// レスポンス処理
		App.client.handler.login = {};
		App.client.handler.login.login = function(data){
			$.cookie('accessToken', data.accessToken, { expires: 90, path: '/' });
			location.href = '/';
		};

	}]);

	angular.module('DialogApp',[]).controller('DialogCtrl', ['$scope', function($scope) {
		$scope.passwordRemind = {
			'email': ''
		};
		$(dialog)
			.find('.sendMail')
				.click(function(e){
					e.preventDefault();
					e.stopPropagation();
					if ($scope.form2.$invalid) {
						$('form[name="form2"]').find('.errors').show();
						return;
					}
					App.client.send('login.passwdRemind', $scope.passwordRemind);
				})
			.end();

		// レスポンス処理
		App.client.handler.login.passwordRemind = function(data){
			location.href = '/';
		};
	}]);

})();

