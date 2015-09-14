'use strict';


angular.module('starter').controller('ReceptionCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading','Receptions', 'jsonRpc', 'Entrepots', 'Fournisseurs', function ($scope, $stateParams, $state, $ionicLoading, Receptions, jsonRpc, Entrepots, Fournisseurs) {

  $scope.validList = [];

  $scope.search = {
    name: null
  };

  $scope.$on('$ionicView.beforeEnter', function(evt, ionicView) {
    $ionicLoading.show({
      template: 'chargement'
    });

    Entrepots.get($stateParams.warehouseId).then(function (e) {
      $scope.entrepot = e;
    }).then(function () {
      return Fournisseurs.get($stateParams.fournisseurId).then(function (f) {
        $scope.fournisseur = f;
      });
    }).then(function () {
      return Receptions.get($scope.entrepot.id, $scope.fournisseur.id).then(function (receptions) {
        $scope.stockList = receptions;
        console.log('receptions', receptions);
      });
    }).finally(function() {
        $ionicLoading.hide();
        
    });

    $scope.bonDeLivraison = decodeURIComponent($stateParams.bonDeLivraison);

  });

  function findIndex(array, test) {
    var length = array.length,
    index = -1;

    while (++index < length) {
      if (test(array[index])) {
        return index;
      }
    }
    return -1;
  }

  $scope.$on('valid.amount', angular.bind($scope, function(e, amount, id) {
    var index = findIndex($scope.validList, function(currItem) {
        return currItem.id === id;
    });

    $scope.validList[index].product_qty = amount;

    var indexStock = findIndex($scope.stockList, function(currItem) {
        return currItem.id === id;
    });

    if (indexStock !== -1) {
      var item = $scope.stockList[indexStock];

      item.product_qty = Math.max(
        0, Math.min(
          item.original_product_qty - amount, item.original_product_qty
        )
      );

      $scope.validList[index].overboard = amount - item.original_product_qty;

      if (amount === 0) {
        $scope.validList.splice(index, 1);
      }
    }
  }));

  
  $scope.goBack = function() {
    $state.go('fournisseur', {warehouseId: $stateParams.warehouseId});
  }

  $scope.doTransfer = function() {

    $ionicLoading.show({
      template: 'Validation'
    });

    var argsList = [[], decodeURIComponent($stateParams.bonDeLivraison)];
    angular.forEach($scope.validList, function(item) {
      argsList[0].push({
        id: item.id,
        product_qty: item.product_qty
      });
    });

    jsonRpc.call('receivoo', 'do_incoming_transfer', argsList)
      .then(function() {
        $ionicLoading.hide();
        $state.go('fournisseur', {warehouseId: $stateParams.warehouseId});
      });
  };

  $scope.removeFromValid = function( item ) {

    var index = findIndex($scope.validList, function(currItem) {
        return currItem.id === item.id;
      });

      if (index !== -1) {
        $scope.validList.splice(index, 1);

        var indexStock = findIndex($scope.stockList, function(currItem) {
            return currItem.id === item.id;
        });

        $scope.stockList[indexStock].product_qty = $scope.stockList[indexStock].original_product_qty;
      }
  };

  $scope.putOnValid = function( item ) {
    if (item.product_qty > 0) {
      var index = findIndex($scope.validList, function(currItem) {
        return currItem.id === item.id;
      });

      if ( index === -1 ) {
        var newItem = angular.copy(item);
        newItem.product_qty = 1;
        $scope.validList.unshift(newItem);

        if (item.notify_add_item) {
          jsonRpc.call('receivoo', 'notify_add_item', [item]);
        }
      }
      else {
        $scope.validList[index].product_qty++;
      }
      if (item.original_product_qty === undefined) {
        item.original_product_qty = item.product_qty;
      }
      item.product_qty--;
    }
  };

}]);
