'use strict';
angular.module('pickadoo')
    .controller('LoginCtrl', function ($rootScope, $scope, jsonRpc, $state) {
        $scope.login = function () {
            jsonRpc.login('test_2014_09_10_bis', $scope.bucheUsername, $scope.buchePassword)
                .then(function(data) {
                    $state.go('list');
                }, function(reason) {
                  $scope.bucheLoginForm.result = {
                    $error: {
                      credentials: true
                    }
                  }
                });
        };
    });
