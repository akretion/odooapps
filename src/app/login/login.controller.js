'use strict';
angular.module('pickadoo')
    .controller('LoginCtrl', function ($rootScope, $scope, jsonRpc, $state) {
        $scope.login = function (loginForm) {
            jsonRpc.login('db', loginForm.loginInput.$modelValue, loginForm.passwordInput.$modelValue)
                .then(function(data) {
                    $state.go('list');
                })
        };
    });
