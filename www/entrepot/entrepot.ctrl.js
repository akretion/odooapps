'use strict';
angular.module('starter')
.controller('EntrepotCtrl', ['$scope', '$state', 'entrepots', function ($scope, $state, entrepots) {
    $scope.entrepots = entrepots;
    $scope.confirm = function() {
      $state.go('reception', {warehouseId: $scope.selected.id});
      return;
    };
}]);
