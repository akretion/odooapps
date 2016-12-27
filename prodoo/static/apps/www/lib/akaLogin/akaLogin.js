'use strict';

angular.module('akaLogin', ['odoo'])
.directive('akaLogin', [ 'jsonRpc', function (jsonRpc) {
    return {
        scope: { successCallback: '&'},
        template: ''+
    '<form ng-submit="submit()">' +
        '<div ng-show="login.feedback">' +
            '<div class="item" ng-show="login.feedback.isError">' +
                '<div ng-switch="login.feedback.error.title" class="assertive">' +
                    '<span ng-switch-when="wrong_login">Identifiant ou mot de passe incorrect</span>' +
                    '<span ng-switch-when="http">Le serveur ne répond pas correctement</span>' +
                    '<span ng-switch-when="database_not_found">Base de données introuvable</span>' +
                    '<span ng-switch-default>Autre raison</span>' +
                '</div>' +
            '</div>' +
            '<div class="item positive" ng-show="login.feedback.isSuccess">' +
                '<strong>Connexion réussie</strong>' +
            '</div>' +
            '<div class="item positive" ng-show="login.feedback.isWaiting">' +
                'Patientez...' +
            '</div>' +
        '</div>' +
        '<label class="item item-input"><span class="input-label">Base de données </span>' +
        '<select ng-options="db for db in databases" ng-model="login.db" required></select></label>' +
        '<label class="item item-input"><span class="input-label">Identifiant </span><input ng-model="login.username" required type="text"></label>' +
        '<label class="item item-input"><span class="input-label">Mot de passe </span><input ng-model="login.password" required type="password"></label>' +
        '<div class="item item-imput"><input type="submit" class="button button-positive" value="Login"/></div>' +
    '</form>'
,
        link: function ($scope, element, attrs) {
            $scope.databases = [];
            $scope.login = {
                db: null,
                username:'',
                feedback: false
            };

            jsonRpc.getDbList().then(function (databases) {
                $scope.databases = databases;
                $scope.login.db = databases[0];
            });

            $scope.submit = function () {
                $scope.login.feedback = { isWating: true };
                jsonRpc.login(
                    $scope.login.db,
                    $scope.login.username,
                    $scope.login.password
                ).then(function (a) {
                    $scope.login.feedback = { isSuccess: true };
                    return $scope.successCallback();
                }, function(e) {
                    $scope.login.feedback = { error: e, isError: true };
                });
            }
        }
    }
}]);