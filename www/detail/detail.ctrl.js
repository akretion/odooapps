'use strict';
angular.module('starter')
    .controller('DetailCtrl', ['$scope', '$stateParams', 'jsonRpc', '$state', 'partner', function ($scope, $stateParams, jsonRpc, $state, partner) {
        $scope.item = partner.data[$stateParams.id];
}]);
