'use strict';

angular.module('starter').controller('LoginCtrl', ['$scope', 'jsonRpc', '$state', '$ionicLoading', function ($scope, jsonRpc, $state, $ionicLoading) {

    $scope.databases = [];
    $scope.login = {
        db: null,
        username:'',
        feedback: false
    };

    $ionicLoading.show({
        template: 'Chargement'
    });

    jsonRpc.getDbList().then(function (databases) {
        $scope.databases = databases;
        $scope.login.db = databases[0];
    }).finally($ionicLoading.hide);


    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.login.feedback = null;
        if ($state.current.name === 'logout')
            jsonRpc.logout(true);
        else {
            //login
            jsonRpc.isLoggedIn(true).then(function (isLoggedIn) {
                if (isLoggedIn)
                    return $state.go('entrepot');
            });
        }

    });


	$scope.submit = function () {
        $scope.login.feedback = { msg: "Patientez...", isError: false };
		jsonRpc.login(
            $scope.login.db,
            $scope.login.username,
            $scope.login.password
        ).then(function (a) {
            $scope.login.feedback = { msg: "Connexion réussie", isError: false };
			$state.go('entrepot');
		}, function(e) {
            $scope.login.feedback = { error: e, isError: true };
		});
	}
}]);