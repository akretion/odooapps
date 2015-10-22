'use strict';
angular.module('starter')
.controller('FournisseurCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', 'Fournisseurs', 'Entrepots', function ($scope, $state, $stateParams, $ionicLoading, Fournisseurs, Entrepots) {


  $scope.$on('$ionicView.beforeEnter', function() {
    $ionicLoading.show({
      template:'Chargement'
    });
  
    $scope.form = {}


    Entrepots.get($stateParams.warehouseId).then(function (e) {
      if (!e.id)
        $state.go('entrepot');
      
      $scope.entrepot = e;
      return e;
    }).then(function (e) {
      return Fournisseurs.getAll(e.id).then(function(fournisseurs) {
        $scope.fournisseurs = fournisseurs;
        //$scope.fournisseurs.push({name:'bim', id:'0'})
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
    Fournisseurs.set($scope.form.selected);

    $state.go('reception', {
      fournisseurId: $scope.form.selected.id,
      warehouseId: $scope.entrepot.id,
      bonDeLivraison: $scope.form.bonLivraison && encodeURIComponent($scope.form.bonLivraison)
    });
    return;
  };

  $scope.selectFournisseur = function(fournisseur) {

    if ($scope.form.selected === fournisseur) {
      $scope.form.selected = null;
      //trigger reset
      document.getElementById('fform').reset(); //TODO move this to a directive
    } else 
      $scope.form.selected = fournisseur;
 
  };

}]);
