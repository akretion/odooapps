'use strict';
angular.module('starter')
.controller('ReceptionCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', 'Fournisseurs', 'Entrepots', function ($scope, $state, $stateParams, $ionicLoading, Fournisseurs, Entrepots) {


  $scope.$on('$ionicView.beforeEnter', function() {
    $ionicLoading.show({
      template:'Chargement'
    });

    $scope.selected = undefined;
    $scope.bonLivraison = undefined;

    Entrepots.getById($stateParams.warehouseId).then(function (e) {
      if (!e.id)
        $state.go('entrepot');
      
      Entrepots.set(e);
      $scope.entrepot = e;
      return e;
    }).then(function (e) {
      return Fournisseurs.getAll(e.id).then(function(fournisseurs) {
        $scope.fournisseurs = fournisseurs;
      });
    }).finally($ionicLoading.hide);
    
  });

  $scope.refresh = function () {
    console.log('refresh');
    $ionicLoading.show({
      template:'Chargement'
    });

    return Fournisseurs.getAll($scope.entrepot.id).then(function(fournisseurs) {
        $scope.fournisseurs = fournisseurs;
    }).finally($ionicLoading.hide);
  }

  $scope.goBack = function() {
    $state.go('entrepot');
  };

  $scope.confirm = function() {
    Fournisseurs.set($scope.selected);

    $state.go('list', {
      fournisseurId: $scope.selected.id,
      warehouseId: $scope.entrepot.id,
      bonDeLivraison: encodeURIComponent($scope.bonLivraison)
    });
    return;
  };
}]);
