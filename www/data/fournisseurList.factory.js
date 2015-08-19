'use strict';

angular.module('starter').factory('fournisseurList', ['$q', 'jsonRpc', function ($q, jsonRpc) {

  return function(fournisseurId, warehouseId) {
    return $q(function(resolve, reject) {
      jsonRpc.call('receivoo', 'get_incoming_move', [parseInt(fournisseurId), parseInt(warehouseId)])
        .then(function(result) {
          resolve(result);
        })
       .catch(function(err) {
          reject(err);
        });
    });
  };
}]);
