'use strict';
angular.module('starter')
    .controller('DetailCtrl', ['$scope', '$stateParams', 'jsonRpc', 'production', function ($scope, $stateParams, jsonRpc, production) {
        $scope.item = production.data[$stateParams.id];
}]);
