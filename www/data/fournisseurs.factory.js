'use strict';

angular.module('starter').factory('fournisseurs', ['$q', 'jsonRpc', function ($q, jsonRpc) {

    return $q(function(resolve, reject) {
      var partners = jsonRpc.searchRead('res.partner', [['supplier', '=', true]])
        .then(function(result) {
          resolve(result);
        })
       .catch(function(err) {
          reject(err);
        });
    });

}]);
