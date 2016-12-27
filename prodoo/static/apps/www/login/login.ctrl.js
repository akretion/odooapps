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
        $state.get('login').data.errors = [];
        $state.go('list', {}, {reload: true, inherit: false}).then(function () {
            //nothing to do, everything alright
        }, function() {
            console.log('ya que ça qui marche visiblement');
            window.location.reload();
        });
    };
}]);