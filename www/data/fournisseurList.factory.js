'use strict';

angular.module('starter').factory('fournisseurList', ['$q', 'jsonRpc', function ($q, jsonRpc) {

  return function(fournisseurId) {
    return $q(function(resolve, reject) {
      jsonRpc.searchRead('stock.move', [['state','=','assigned'],['picking_id.partner_id','=',parseInt(fournisseurId)]])
        .then(function(result) {
          resolve(result);
        })
       .catch(function(err) {
          reject(err);
        });
    });
  }
}]);
