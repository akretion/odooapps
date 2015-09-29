'use strict';

angular.module('starter').controller('LoginCtrl', ['$scope', '$state', 'jsonRpc', '$ionicLoading', function ($scope, $state, jsonRpc, $ionicLoading) {

    $ionicLoading.show({
          template: 'Chargement'
    });

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.errors = $state.get('login').data.errors;
        if ($state.current.name === 'logout') {
            jsonRpc.logout(true);
            $ionicLoading.hide();
        } else {
            //login
            jsonRpc.isLoggedIn(true).then(function (isLoggedIn) {
                $ionicLoading.hide();
                $state.get('login').data.errors = [];
                if (isLoggedIn)
                    return $scope.successCallback();

            });
        }
    });

    $scope.successCallback = function () {
        $state.go('list');
	};
}]);