'use strict';


angular.module('starter').factory('entrepots', ['$q', 'jsonRpc', '$ionicLoading', function ($q, jsonRpc, $ionicLoading) {

  $ionicLoading.show({
    template: 'Chargement'
  });

  return $q(function(resolve, reject) {
    jsonRpc.call('receivoo', 'get_picking_type', [])
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
