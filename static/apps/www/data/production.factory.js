'use strict';


angular.module('starter').factory('production', ['$q', 'jsonRpc', function ($q, jsonRpc) {
    
    var mrpProduction = jsonRpc.syncImportObject({
          model: 'mrp.production',
          func_key: 'prodoo',
          base_domain: [],
          filter_domain: [['state', 'in', ['confirmed', 'ready']]],
          limit: 50,
          interval: 30000,
    });

    return $q(function(resolve, reject) {
        mrpProduction.watch(function () {
            return resolve(mrpProduction);
        });
    });
}]);
