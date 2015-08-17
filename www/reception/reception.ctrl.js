'use strict';
angular.module('starter')
.controller('ReceptionCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', 'fournisseurs', function ($scope, $state, $stateParams, $ionicLoading, fournisseurs) {

  $ionicLoading.show({
    template:'Chargement'
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.selected = undefined;
    $scope.bonLivraison = undefined;

    fournisseurs($stateParams.warehouseId)
      .then(function(result) {
        $ionicLoading.hide();
        $scope.fournisseurs = result;
      });
  });


  $scope.confirm = function() {
    $state.go('list', {
      fournisseurId: $scope.selected.id,
      warehouseId: $stateParams.warehouseId,
      bonDeLivraison: encodeURIComponent($scope.bonLivraison)
    });
    return;
  };
}]);
