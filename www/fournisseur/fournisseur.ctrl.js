'use strict';
angular.module('starter')
.controller('FournisseurCtrl', ['$q','$scope', '$state', '$stateParams', '$ionicLoading', 'Fournisseurs', 'Entrepots', function ($q, $scope, $state, $stateParams, $ionicLoading, Fournisseurs, Entrepots) {


  $scope.$on('$ionicView.beforeEnter', function() {
    $ionicLoading.show({
      template:'Chargement'
    });
  
    $scope.form = {}
    $scope.entrepots = null;
    
    if (!$stateParams.warehouseId) {
      $scope.entrepots = Entrepots.getAll();
      $scope.entrepot = null;
    } else {
      $scope.entrepots = Entrepots.get($stateParams.wharehouseId).then(function (e) {
        return [e]; //be consistent with Entrepots.getAll()
      });
      $scope.entrepot = $stateParams.wharehouseId;
    }

    loadFournisseurs($scope.entrepots).finally($ionicLoading.hide);
    
  });

  $scope.refresh = function () {
    console.log('refresh');
    $ionicLoading.show({
      template:'Chargement'
    });

    return loadFournisseurs($scope.entrepots).finally($ionicLoading.hide);
  }

  $scope.goBack = function() {
    $state.go('entrepot');
  };

  $scope.confirm = function() {
    Fournisseurs.set($scope.form.selected);

    $state.go('reception', {
      fournisseurId: $scope.form.selected.id,
      warehouseId: $scope.entrepot,
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
  $scope.changed = function (...e) {
    console.log('changed', e, $scope.form.selected)
  }
  function loadFournisseurs(entrepotsPromise) {
    $scope.fournisseurs = []; //reset
    var fournisseurs = [];

    return entrepotsPromise.then(function (entrepots) {
      $q.all(entrepots.map(function (e) {
        return Fournisseurs.getAll(e.id).then(function(someFournisseurs) {
          fournisseurs = fournisseurs.concat(someFournisseurs);
        });
      })).then(function() {
        // a same fournisseur can happen twice
        // add it only once in $scope.fournisseurs
        var fIds = [];
        $scope.fournisseurs = fournisseurs.filter(function (f) {
          if (fIds.indexOf(f.id) == -1) {
            fIds.push(f.id);
            return true;
          }
          return false;
        });
      });
    });
  } 
}]);
