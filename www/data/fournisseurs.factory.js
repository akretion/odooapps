'use strict';

angular.module('starter').factory('fournisseurs', ['$q', 'jsonRpc', function ($q, jsonRpc) {
    return function(pickingType) {

      return $q(function(resolve, reject) {
        var partners = jsonRpc.call('receivoo', 'get_supplier', [parseInt(pickingType)])
          .then(function(result) {
            resolve(result);
          })
         .catch(function(err) {
            reject(err);
          });
      });
    };

}]);
