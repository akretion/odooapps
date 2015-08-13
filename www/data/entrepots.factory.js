'use strict';


angular.module('starter').factory('entrepots', ['$q', 'jsonRpc', function ($q, jsonRpc) {

    return $q(function(resolve, reject) {
      jsonRpc.searchRead('stock.warehouse', [])
        .then(function(result) {
          resolve(result);
        })
       .catch(function(err) {
          reject(err);
        });
    });
}]);
