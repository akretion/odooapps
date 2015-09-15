'use strict';

angular.module('starter').controller('LoginCtrl', ['$scope', 'jsonRpc', '$state', '$ionicLoading', function ($scope, jsonRpc, $state, $ionicLoading) {

    $scope.$on('$ionicView.beforeEnter', function() {
        if ($state.current.name === 'logout')
            jsonRpc.logout(true);
        else {
            //login
            jsonRpc.isLoggedIn(true).then(function (isLoggedIn) {
                if (isLoggedIn)
                    return $scope.successCallback();
            });
        }
    });

	$scope.successCallback = function () {
        $state.go('entrepot');
    };
}]);