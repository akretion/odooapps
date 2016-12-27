'use strict';
angular.module('starter')
.controller('EntrepotCtrl', ['$scope', '$state', 'Entrepots', '$q', '$ionicLoading', function ($scope, $state, Entrepots, $q, $ionicLoading) {

  $ionicLoading.show({
    template: 'Chargement'
  });

  $scope.selected = null;

  $scope.$on('$ionicView.beforeEnter', function() {
    
    Entrepots.getAll().then(function (entrepots) {
      $scope.entrepots = entrepots;
    }).finally($ionicLoading.hide);


    $q.all([Entrepots.getAll(), Entrepots.get()]).then(function (all) {
      var entrepots = all[0];
      var entrepot = all[1];

      if (!entrepot)
        return;

      //check that saved entrepot is still available
      entrepots.some(function (e) {
        if (e.id !== entrepot.id)
          return false;

        $scope.selected = entrepot;
        return true;
      });
    });
  });

  $scope.confirm = function() {
    Entrepots.set($scope.selected);
    $state.go('fournisseur', {warehouseId: $scope.selected && $scope.selected.id});
  };
}]);