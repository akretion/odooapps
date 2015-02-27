'use strict';
angular.module('pickadoo')
    .controller('LoginCtrl', function ($scope, jsonRpc, $state) {
        $scope.login = function (loginForm) {
            jsonRpc.login('db', loginForm.loginInput.$modelValue, loginForm.passwordInput.$modelValue)
                .success(function(data) {
                    $state.go('list');
                })
        };

    });

