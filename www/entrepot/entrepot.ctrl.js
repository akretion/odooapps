'use strict';
angular.module('starter')
.controller('EntrepotCtrl', ['$scope', '$state', 'entrepots', '$cookies', function ($scope, $state, entrepots, $cookies) {

  $scope.entrepots = entrepots;
  $scope.$on('$ionicView.beforeEnter', function() {
    angular.forEach($scope.entrepots, function(entrepot) {
      if (entrepot.id === parseInt($cookies.get('reception.entrepot.id'))) {
        $scope.selected = entrepot;
      }
    });
  });

  $scope.confirm = function() {
    $cookies.put('reception.entrepot.id', $scope.selected.id);
    $cookies.put('reception.entrepot.name', $scope.selected.name);
    $state.go('reception', {warehouseId: $scope.selected.id});
    return;
  };
}]);
