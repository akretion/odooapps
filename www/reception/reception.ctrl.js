'use strict';
angular.module('starter')
.controller('ReceptionCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$cookies', 'fournisseurs', function ($scope, $state, $stateParams, $ionicLoading, $cookies, fournisseurs) {

  $ionicLoading.show({
    template:'Chargement'
  });


  var warehouseId;

  $scope.$on('$ionicView.beforeEnter', function() {

    if (!$cookies.get('reception.entrepot.id') && !$stateParams.warehouseId) {
      $state.go('entrepot');
    }
    else if (!$cookies.get('reception.entrepot.id')) {
      $cookies.put('reception.entrepot.id', $stateParams.warehouseId);
    }

    $scope.entrepotName = decodeURIComponent($cookies.get('reception.entrepot.name'));
    $scope.entrepotName = $scope.entrepotName.charAt(0) + $scope.entrepotName.slice(1).toLowerCase();
    warehouseId = $stateParams.warehouseId || $cookies.get('reception.entrepot.id');
    $scope.$apply();
  });

  $scope.goBack = function() {
    $state.go('entrepot');
  };


  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.selected = undefined;
    $scope.bonLivraison = undefined;


    fournisseurs(warehouseId)
      .then(function(result) {
        $ionicLoading.hide();
        $scope.fournisseurs = result;
      });
  });


  $scope.confirm = function() {
    $cookies.put('reception.fournisseur.name', $scope.selected.name);
    $state.go('list', {
      fournisseurId: $scope.selected.id,
      warehouseId: warehouseId,
      bonDeLivraison: encodeURIComponent($scope.bonLivraison)
    });
    return;
  };
}]);
