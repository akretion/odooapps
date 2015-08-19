'use strict';


angular.module('starter').controller('ListCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', 'fournisseurList', 'jsonRpc', '$cookies', '$ionicSideMenuDelegate', function ($scope, $stateParams, $state, $ionicLoading, fournisseurList, jsonRpc, $cookies, $ionicSideMenuDelegate) {

  this.validList = [];

  this.search = {
    name: {}
  };

  $ionicLoading.show({
    template: 'chargement'
  });

  $scope.$on('$ionicView.beforeEnter', angular.bind(this, function() {
    fournisseurList($stateParams.fournisseurId, $stateParams.warehouseId)
      .then(angular.bind(this, function(result) {
        this.stockList = result;
        $ionicLoading.hide();
      }));

    this.entrepotName = decodeURIComponent($cookies.get('reception.entrepot.name'));
    this.entrepotName = this.entrepotName.charAt(0) + this.entrepotName.slice(1).toLowerCase();

    this.fournisseurName = decodeURIComponent($cookies.get('reception.fournisseur.name'));

    this.bonDeLivraison = decodeURIComponent($stateParams.bonDeLivraison);

    $scope.$apply();
  }));

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

  $scope.$on('valid.amount', angular.bind(this, function(e, amount, id) {
    var index = findIndex(this.validList, function(currItem) {
        return currItem.id === id;
    });

    this.validList[index].product_qty = amount;

    var indexStock = findIndex(this.stockList, function(currItem) {
        return currItem.id === id;
    });

    if (indexStock !== -1) {
      var item = this.stockList[indexStock];

      item.product_qty = Math.max(
        0, Math.min(
          item.original_product_qty - amount, item.original_product_qty
        )
      );

      this.validList[index].overboard = amount - item.original_product_qty;

      if (amount === 0) {
        this.validList.splice(index, 1);
      }
    }
  }));

  this.getEntrepotName = function() {
    return this.entrepotName;
  };

  this.getFournisseurName = function() {
    return this.fournisseurName;
  };

  this.goBack = function() {
    $state.go('reception', {warehouseId: $stateParams.warehouseId});
  }

  this.doTransfer = function() {

    $ionicLoading.show({
      template: 'Validation'
    });

    var argsList = [[], decodeURIComponent($stateParams.bonDeLivraison)];
    angular.forEach(this.validList, function(item) {
      argsList[0].push({
        id: item.id,
        product_qty: item.product_qty
      });
    });

    jsonRpc.call('receivoo', 'do_incoming_transfer', argsList)
      .then(function() {
        $ionicLoading.hide();
        $state.go('reception', {warehouseId: $stateParams.warehouseId});
      });
  };

  this.removeFromValid = function( item ) {

    var index = findIndex(this.validList, function(currItem) {
        return currItem.id === item.id;
      });

      if (index !== -1) {
        this.validList.splice(index, 1);

        var indexStock = findIndex(this.stockList, function(currItem) {
            return currItem.id === item.id;
        });

        this.stockList[indexStock].product_qty = this.stockList[indexStock].original_product_qty;
      }
  };

  this.putOnValid = function( item ) {
    if (item.product_qty > 0) {
      var index = findIndex(this.validList, function(currItem) {
        return currItem.id === item.id;
      });

      if ( index === -1 ) {
        var newItem = angular.copy(item);
        newItem.product_qty = 1;
        this.validList.unshift(newItem);

        if (item.notify_add_item) {
          jsonRpc.call('receivoo', 'notify_add_item', [item]);
        }
      }
      else {
        this.validList[index].product_qty++;
      }
      if (item.original_product_qty === undefined) {
        item.original_product_qty = item.product_qty;
      }
      item.product_qty--;
    }
  };

}]);
