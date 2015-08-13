'use strict';
angular.module('starter')
.controller('ReceptionCtrl', ['$scope', '$state', 'fournisseurs', function ($scope, $state, fournisseurs) {
  $scope.fournisseurs = fournisseurs;
  $scope.confirm = function() {
    $state.go('list',{fournisseurId:$scope.selected.id});
    return;
  }
}]);
