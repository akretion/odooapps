'use strict';
angular.module('starter')
.controller('EntrepotCtrl', ['$scope', '$state', 'entrepots', function ($scope, $state, entrepots) {
    $scope.entrepots = entrepots.records;
    $scope.confirm = function() {
      $state.go('reception');
      return;
    };
}]);
