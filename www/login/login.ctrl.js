'use strict';

angular.module('starter').controller('LoginCtrl', ['$scope', '$state', 'jsonRpc', '$ionicLoading', function ($scope, $state, jsonRpc, $ionicLoading) {

    $ionicLoading.show({
          template: 'Chargement'
    });

    $scope.$on('$ionicView.beforeEnter', function() {
        if ($state.current.name === 'logout') {
            jsonRpc.logout(true);
            $ionicLoading.hide();
        } else {
            //login
            jsonRpc.isLoggedIn(true).then(function (isLoggedIn) {
                if (isLoggedIn)
                    return $scope.successCallback();
            }).then($ionicLoading.hide);
        }
    });

    $scope.successCallback = function () {
        $state.go('list');
	};
}]);