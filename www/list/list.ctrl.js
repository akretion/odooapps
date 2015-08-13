'use strict';


angular.module('starter').controller('ListCtrl', ['$scope', '$stateParams', 'fournisseurList', function ($scope, $stateParams, fournisseurList) {

  $scope.validList = [];

  $scope.search = {
    name:{},
  };

  fournisseurList($stateParams.fournisseurId)
    .then(function(result) {
      $scope.stockList = result.records;
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

  $scope.$on('valid.amount', function(e, amount, id) {
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
  });

  $scope.removeFromValid = function( item ) {
    
      var index = findIndex($scope.validList, function(currItem) {
        return currItem.id === item.id;
      });

      if (index != -1) {
        $scope.validList.splice(index,1);

        var indexStock = findIndex($scope.stockList, function(currItem) {
            return currItem.id === item.id;
        });

        $scope.stockList[indexStock].product_qty = $scope.stockList[indexStock].original_product_qty;
      }
  }


  $scope.putOnValid = function( item ) {
    if (item.product_qty > 0) {
      var index = findIndex($scope.validList, function(currItem) {
        return currItem.id === item.id;
      });

      if ( index === -1 ) {
        var newItem = angular.copy(item);
        newItem.product_qty = 1;
        $scope.validList.push(newItem);
      }
      else {
        $scope.validList[index].product_qty++;
      }
      if (item.original_product_qty === undefined) {
        item.original_product_qty = item.product_qty;
      }
      item.product_qty--;

    }
  }

}]);
