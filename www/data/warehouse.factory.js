'use strict';


angular.module('starter').factory('warehouse', ['$q', 'jsonRpc', '$ionicLoading', function ($q, jsonRpc, $ionicLoading) {

  $ionicLoading.show({
    template: 'Chargement'
  });

  return $q(function(resolve, reject) {
    jsonRpc.call('prodoo', 'get_warehouse', [])
      .then(function(result) {
        $ionicLoading.hide();
        resolve(result);
      })
     .catch(function(err) {
        $ionicLoading.hide();
        reject(err);
      });
  });
}]);
